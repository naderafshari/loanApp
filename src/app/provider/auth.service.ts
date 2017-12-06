import { subscribeOn } from 'rxjs/operator/subscribeOn';
import { async } from '@angular/core/testing';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Observable, Subject, BehaviorSubject } from 'rxjs/Rx';
import { Router } from "@angular/router";
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { UserInfo } from '../model/user-info'

@Injectable()
export class AuthService {

  user: Observable<UserInfo>;
  userDoc: Observable<{}>;
  userInfo: UserInfo;
  
  constructor(private firebaseAuth: AngularFireAuth, private router:Router, private afs: AngularFirestore) {
    
    this.user = this.firebaseAuth.authState
    .switchMap(user => {
      if (user) {
          this.userDoc = this.afs.doc(`users/${user.uid}`).valueChanges();
          this.userDoc.subscribe((data: UserInfo) => {
            this.userInfo = data;
          });
          return this.afs.doc<UserInfo>(`users/${user.uid}`).valueChanges()
      } else {
        return Observable.of(null)
      }
    })
  }

  private setUserAuthData(userAuth, displayName) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${userAuth.uid}`);
    const AuthData: UserInfo = {
        uid: userAuth.uid,
        email: userAuth.email,
        displayName: displayName,
        photoURL: userAuth.photoURL,
        role: 'super-user'
    }
    return userRef.set(AuthData)
    //.catch ( (err) => alert(err));
  }
    //return userRef.snapshotChanges()
    //.map(action => action.payload.exists)
    //.subscribe(exists => exists ? userRef.update(userData) : userRef.set(userData));

  // Returns true if user is logged in
  get authenticated(): boolean {
      return this.user !== null;
  }

  get userAuthRole(): string {
    return this.authenticated ? this.userInfo.role: null;
  }
  
    // Returns current user data
    get currentUser(): any {
//      return this.authenticated ? this.firebaseAuth.authState : null;
      return this.authenticated ? this.user : null;
    }

    // Returns
    get currentUserObservable(): any {
      return this.firebaseAuth.authState
    }
  
    // Returns current user UID
    get currentUserId(): any {
      return this.authenticated ? this.userInfo.uid : '';
    }

    // Returns current user displayName
    get currentUserDisplayName(): string {
      return this.authenticated ? this.userInfo.displayName : '';
    }
    
    // Returns current user UID
    get currentUserEmail(): string {
      return this.authenticated ? this.firebaseAuth.auth.currentUser.email : '';
    }
    
    signup(email: string, password: string, displayName: string) {
    return this.firebaseAuth
      .auth
      .createUserWithEmailAndPassword(email, password)
      .then( (value) => {
        console.log("signup success");
        this.setUserAuthData(value, displayName)
        .then(()=> this.router.navigate(['/user-profile',0]))
        .catch(err => {
          console.log(err);
          alert(err);
        });
      })
      .catch(err => {
        alert('Something went wrong: ' + err.message);
        console.log('Something went wrong:',err.message);
      });
  }

  login(email: string, password: string) {
    return this.firebaseAuth
      .auth
      .signInWithEmailAndPassword(email, password)
      .then( (value) => {
        console.log("login success");
        this.user.subscribe( (data) => {
          if (data){
            this.userInfo = data;
            console.log("Role of logged in user: ", this.userInfo.role);
            this.router.navigate(['/user-profile',0])
          }
        });
    })
      .catch(err => {
        console.log(err)
        alert(err);
      }
    );
  }
  
  logout() {
    return this.firebaseAuth.auth.signOut()
    .then(
      () => {
        this.firebaseAuth.authState.subscribe(() =>     
          this.router.navigateByUrl('/login'))
      })
      .catch(err => {
          alert('logout failed: ' + err);
      });
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
        this.afs.collection('users').doc(value.user.uid).update({
            'displayName': value.user.displayName
        })
        .then( () => {
            this.router.navigate(['/user-profile',0])
        })
        .catch ( () => {
          this.afs.collection('users').doc(value.user.uid).set({
            'displayName': value.user.displayName,
            'email': value.user.email,
            'uid': value.user.uid,
            'photoURL': value.user.photoURL
            })
            .then( () => {
              alert('Your password may not have been set correctly! To use email/password login method in the future, password reset may be needed')
              this.router.navigate(['/user-profile',0]);
            })
        })
    })
    .catch((err) => {
        console.log(err)
        alert(err)
      }
    )
  }

}
