import { userInfo } from 'os';
import { async } from '@angular/core/testing';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AuthInfo } from "./auth-info";
import * as firebase from 'firebase/app';
import { Observable, Subject, BehaviorSubject } from 'rxjs/Rx';
import { Router } from "@angular/router";
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { UserAuth, UserAuthInfo } from './user-info'
@Injectable()
export class AuthService {
  /*user: Observable<firebase.User>;
  static UNKNOWN_USER = new AuthInfo(null);
  authInfo$: BehaviorSubject<AuthInfo> = new BehaviorSubject<AuthInfo>(AuthService.UNKNOWN_USER);
  fromFirebaseAuthPromise(promise):Observable<any> {
    const subject = new Subject<any>();
    promise
        .then(res => {
                const authInfo = new AuthInfo(this.firebaseAuth.auth.currentUser.uid);
                this.authInfo$.next(authInfo);
                subject.next(res);
                subject.complete();
            },
            err => {
                this.authInfo$.error(err);
                subject.error(err);
                subject.complete();
            });

    return subject.asObservable();
  }
  */  
  
  user: Observable<UserAuthInfo>;
  constructor(private firebaseAuth: AngularFireAuth, private router:Router, private afs: AngularFirestore) {
    //this.user = firebaseAuth.authState;
    
    this.user = this.firebaseAuth.authState
    .switchMap(user => {
      if (user) {
        return this.afs.doc<UserAuthInfo>(`users-auth/${user.uid}`).valueChanges()
      } else {
        return Observable.of(null)
      }
    })
  }
  private updateAuthUserData(user) {
    // Sets user data to firestore on login
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users-auth/${user.uid}`);
    const data: UserAuthInfo = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL
    }
    return userRef.set(data)
  }

  // Returns true if user is logged in
    get authenticated(): boolean {
      return this.firebaseAuth.authState !== null;
    }
  
    // Returns current user data
    get currentUser(): any {
      return this.authenticated ? this.firebaseAuth.authState : null;
    }

    // Returns current user data
    get currentUserInfo(): any {
      return this.authenticated ? this.firebaseAuth.auth.currentUser : null;
    }    
  
    // Returns
    get currentUserObservable(): any {
      return this.firebaseAuth.authState
    }
  
    // Returns current user UID
    get currentUserId(): any {
      return this.authenticated ? this.firebaseAuth.auth.currentUser.uid : '';
    }

    // Returns current user displayName
    get currentUserDisplayName(): string {
      return this.authenticated ? this.firebaseAuth.auth.currentUser.displayName : '';
    }
    
    // Returns current user UID
    get currentUserEmail(): string {
      return this.authenticated ? this.firebaseAuth.auth.currentUser.email : '';
    }
    
    signup(email: string, password: string) {
    return this.firebaseAuth
      .auth
      .createUserWithEmailAndPassword(email, password)
      .then( (value) => {
        console.log('Nice, it worked! value is: ', value);
        this.updateAuthUserData(value);
        this.router.navigateByUrl('/user-profile');
      })
      .catch(err => {
        console.log('Something went wrong:',err.message);
        this.router.navigateByUrl('/login');
      });
  }

  login(email: string, password: string) {
    return this.firebaseAuth
      .auth
      .signInWithEmailAndPassword(email, password)
      .then( (value) => {
        console.log('Nice, it worked! value is: ', value);
        this.updateAuthUserData(value);
        this.router.navigateByUrl('/user-profile');
      })
      .catch(err => {
        console.log('Something went wrong:',err.message);
        this.router.navigateByUrl('/login');
      });
  }
  
  logout() {
    return this.firebaseAuth.auth.signOut();
  }

  resetPassword(email: string) {
    return this.firebaseAuth.
     auth.sendPasswordResetEmail(email);
      //.then(
      //  () => {console.log("email sent");
      //  this.router.navigateByUrl('/email-login');
      //  }
      //)
      //.catch((error) => console.log(error))
  }

  //// Social Auth ////
  githubLogin() {
    const provider = new firebase.auth.GithubAuthProvider()
    return this.socialSignIn(provider);
  }

  googleLogin() {
    const provider = new firebase.auth.GoogleAuthProvider()
    return this.socialSignIn(provider);
  }

  facebookLogin() {
    const provider = new firebase.auth.FacebookAuthProvider()
    return this.socialSignIn(provider);
  }

  twitterLogin(){
    const provider = new firebase.auth.TwitterAuthProvider()
    return this.socialSignIn(provider);
  }

  private socialSignIn(provider) {
    return this.firebaseAuth.auth.signInWithPopup(provider)
    .then( (value) => {
        console.log("login success");
        this.updateAuthUserData(value.user);        
        this.afs.collection('users').doc(this.currentUserId).update({
            'displayName': value.user.displayName
        })
        .then( () => {
          this.router.navigateByUrl('/user-profile');
        })
        .catch ( () => {
          this.afs.collection('users').doc(this.currentUserId).set({
            'displayName': value.user.displayName,
            'email': value.user.email
            })
            .then( () => {
              alert('Your password may not have been set correctly! To use email/password login method in the future, password reset may be needed')
              this.router.navigateByUrl('/user-profile');
            })
        })
    })
    .catch((error) => {
        console.log(error)
        error => alert(error)
      }
    )
  }

}
