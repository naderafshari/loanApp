import { subscribeOn } from 'rxjs/operator/subscribeOn';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Http, Headers, Response, URLSearchParams } from '@angular/http';
import { async } from '@angular/core/testing';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Observable, Subject, BehaviorSubject } from 'rxjs/Rx';
import { Router } from '@angular/router';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { UserInfo } from '../model/user-info';
import { FormService } from './form.service';
import { Subscription } from 'rxjs/Subscription';
import * as _ from 'lodash';

@Injectable()
export class AuthService {

  user: Observable<UserInfo>;
  userDoc: Observable<{}>;
  userInfo: UserInfo;

  endpoint = 'https://us-central1-carloanapp.cloudfunctions.net/httpEmail';

  constructor(private firebaseAuth: AngularFireAuth, private router: Router,
    private afs: AngularFirestore, private fs: FormService, private http: HttpClient) {

    this.user = this.firebaseAuth.authState
    .switchMap(user => {
      if (user) {
          this.userDoc = this.afs.doc(`users/${user.uid}`).valueChanges();
          this.userDoc.subscribe((data: UserInfo) => {
              this.userInfo = data;
          });
          return this.userDoc;
      } else {
        return Observable.of(null);
      }
    });
  }

  private setUserAuthData(userAuth, displayName) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${userAuth.uid}`);
    const AuthData: UserInfo = {
        uid: userAuth.uid,
        email: userAuth.email,
        displayName: displayName,
        photoURL: userAuth.photoURL,
        role: 'user',
        function: '',
        joinTime: new Date().toString(),
        updateTime: new Date().toString(),
        assignedForms: {},
        purchased: []
    };
    // const calRef: AngularFirestoreDocument<any> = this.afs.doc(`calendar/${userAuth.uid}`);
    // calRef.set({calId: `${userAuth.uid}`});
    return userRef.set(AuthData);
  }

  // Returns true if user is logged in
  get authenticated(): boolean {
    return this.firebaseAuth.authState !== null;
    // return this.user !== null; //same thing
  }

  get userAuthRole(): string {
    return this.authenticated && this.userInfo ? this.userInfo.role : null;
  }

  get userFunction(): string {
    return this.authenticated && this.userInfo ? this.userInfo.function : null;
  }
  // Returns current user data
  get currentUser(): any {
      return this.authenticated ? this.firebaseAuth.authState : null;
      // return this.authenticated ? this.user : null; if a user has a login but no user doc, this don't work
  }

  // Returns
  get currentUserObservable(): any {
    return this.firebaseAuth.authState;
  }

  // Returns current user Info
  get currentUserInfo(): UserInfo {
    return this.authenticated ? this.userInfo : null;
  }

  // Returns current user UID
  get currentUserId(): any {
    // return this.authenticated ? this.userInfo.uid : '';
    return this.authenticated ? this.firebaseAuth.auth.currentUser.uid : '';
  }

  // Returns current user displayName
  get currentUserDisplayName(): string {
    return this.authenticated && this.userInfo ? this.userInfo.displayName : '';
  }

  // Returns current user UID
  get currentUserEmail(): string {
    return this.authenticated ? this.firebaseAuth.auth.currentUser.email : '';
  }

  changeEmail(newEmail, oldEmail, password) {
    firebase.auth()
      .signInWithEmailAndPassword(oldEmail, password)
      .then(user => {
          user.updateEmail(newEmail);
      });
  }

  signup(email: string, password: string, displayName: string) {
    return this.firebaseAuth
    .auth
    .createUserWithEmailAndPassword(email, password)
    .then( (user) => {
      user.sendEmailVerification()
      .then(() => {
        this.setUserAuthData(user, displayName)
        .then(() =>  {
          alert('A Verification Email was sent to your login email. \
          After receiving the email, click on the provided link and log back in.');
          // console.log('signup success for user: ', user);
          this.logout();
        })
        .catch(err => {
          alert('Something went wrong saving new user: ' + err.message);
          console.log('Something went wrong saving new user:', err.message);
        });
      })
      .catch(err => {
        alert('Something went wrong sending verification email: ' + err.message);
        console.log('Something went wrong sending verification email:', err.message);
      });
    })
    .catch(err => {
      alert('Something went wrong creating account: ' + err.message +
      'You may have used social media (google, facebook etc.) to login previously.');
      console.log('Something went wrong creating account:', err.message);
    });
  }

  login(email: string, password: string) {
    return this.firebaseAuth
      .auth
      .signInWithEmailAndPassword(email, password)
      .then( (user) => {
        if (user.emailVerified) {
          const sub: Subscription = this.afs.doc(`users/${user.uid}`).valueChanges().subscribe((data: UserInfo) => {
            this.userInfo = data;

            this.sendWelcomeEmail(data);

            this.upsert(this.userInfo);
            sub.unsubscribe();
          });
        } else {
          user.sendEmailVerification().then(() => {
            alert('The login email is not verified. Check your email for another verification email.');
            this.logout();
          });
        }
      })
      .catch( (err) => alert('Login failed! ' + err));
  }

  private socialSignIn(provider) {
    return this.firebaseAuth.auth.signInWithPopup(provider)
    .then( (value) => {
      if (value.user.emailVerified) { // social emails are typically validated
        const sub: Subscription = this.afs.doc(`users/${value.user.uid}`).valueChanges()
        .subscribe((data: UserInfo) => {
          if (data) { // not first time
            this.userInfo = data;
            this.upsert(this.userInfo);
          } else { // first time
            this.upsert(value.user);
          }
          sub.unsubscribe();
        });
      } else {
          value.user.sendEmailVerification().then(() => {
            alert('The login email is not verified. Verify your email with the Social media provider.');
            this.logout();
          });
      }
    })
    .catch( (err) =>  alert('Login failed! ' + err));
  }

  upsert(user) {
    const authData: UserInfo = {
      'displayName': user.displayName,
      'email': user.email,
      'uid': user.uid,
      'photoURL': user.photoURL,
      'updateTime': new Date().toString()
    };
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);
    userRef.update(authData)
    .then(() => {
      // if (this.userInfo.lastName) {
        // if personal info hasn't been collected yet
        if (this.userInfo.role === 'admin') {
          this.router.navigateByUrl('/user-manage');
        } else if (this.userInfo.function === 'borrower') {
          this.router.navigateByUrl('/borrower-portal');
        } else if (this.userInfo.function === 'lender') {
          this.router.navigateByUrl('/lender-portal');
        } else {
          this.router.navigateByUrl('/user-function');
        }
    // } else {
        // if last name is not set it means the signup process was not completed, go back to function
    //    this.router.navigateByUrl('/user-function');
    //  }
    })
    .catch(() => {
      userRef.set({
        'displayName': user.displayName,
        'email': user.email,
        'uid': user.uid,
        'photoURL': user.photoURL,
        'joinTime': new Date().toString(),
        'updateTime': new Date().toString(),
        'role': 'user',
        'assignedForms': {},
        'purchased': []
      })
      .then( () => {
        // Send Welcome email
//        this.sendWelcomeEmail(authData);
        this.router.navigateByUrl('/user-function');
      })
      .catch((err) => {
        console.log(err);
        alert(err);
      });
    });
  }

  logout() {
    return this.firebaseAuth.auth.signOut()
    .then( () => this.router.navigateByUrl('/login'))
    .catch(err => alert('logout failed: ' + err));
  }

  deleteAuthCurrentUser() {
    return this.firebaseAuth
    .auth
    .currentUser.delete();
  }

  resetPassword(email: string) {
    return this.firebaseAuth.
     auth.sendPasswordResetEmail(email);
  }

  //// Social Auth ////
  githubLogin() {
    const provider = new firebase.auth.GithubAuthProvider();
    return this.socialSignIn(provider);
  }

  googleLogin() {
    const provider = new firebase.auth.GoogleAuthProvider();
    return this.socialSignIn(provider);
  }

  facebookLogin() {
    const provider = new firebase.auth.FacebookAuthProvider();
    return this.socialSignIn(provider);
  }

  twitterLogin() {
    const provider = new firebase.auth.TwitterAuthProvider();
    return this.socialSignIn(provider);
  }

sendWelcomeEmail(userInfo) { // no workie!
/* const headers = new HttpHeaders({'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
   const params: URLSearchParams = new URLSearchParams();
    params.set('to', userInfo.email);
    params.set('from', 'carloanrefi@gmail.com');
    params.set('subject', 'Welcome Email');
    params.set('content', 'Welcome Email');
*/
  const httpOptions = {
    headers: new HttpHeaders({
    'Content-Type':  'application/json',
  //    'Authorization': 'my-auth-token',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS'
    })
  };

  // httpOptions.headers.append('Content-Type', 'application/json');
  // httpOptions.headers.append('Access-Control-Allow-Origin', '*');

    const data = {
      to: userInfo.email,
      from: 'carloanrefi@gmail.com',
      subject: 'Welcome Email',
      content: 'Welcome Email'
    };

console.log('Sending Welcome Email', data);
    this.http.post(this.endpoint, data)
//    this.http.post('http://jsonplaceholder.typicode.com/posts', data)
    // this.http.post(this.endpoint, data)
    .subscribe(
      (val) => {
          console.log('POST call successful value returned in body', val);
      },
      response => {
          console.log('POST call in error', response);
      },
      () => {
          console.log('The POST observable is now completed.');
      });

    /*
    .toPromise()
    .then( res => {
      console.log(res);
    })
    .catch(err => {
      console.log(err);
    });*/
}

}
