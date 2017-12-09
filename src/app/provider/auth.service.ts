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
          return this.userDoc;
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
        role: 'user'
    }
    return userRef.set(AuthData)
  }

  // Returns true if user is logged in
  get authenticated(): boolean {
    return this.firebaseAuth.authState !== null;
    //return this.user !== null; //same thing
  }

  get userAuthRole(): string {
    return this.authenticated ? this.userInfo.role: null;
  }
  
  // Returns current user data
  get currentUser(): any {
      return this.authenticated ? this.firebaseAuth.authState : null;
//      return this.authenticated ? this.user : null; if a user has a login but no user doc, this don't work
  }

  // Returns
  get currentUserObservable(): any {
    return this.firebaseAuth.authState
  }

  // Returns current user Info
  get currentUserInfo(): any {
    return this.authenticated ? this.userInfo : null;
  }

  // Returns current user UID
  get currentUserId(): any {
    //return this.authenticated ? this.userInfo.uid : '';
    return this.authenticated ? this.firebaseAuth.auth.currentUser.uid : '';
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
      //.then(()=> this.router.navigateByUrl('/user-manage'))
      .then(()=> this.router.navigate(['/user-profile',value.uid]))
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
        console.log("login success uid = ", value.uid, "email = ", value.email);
        const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${value.uid}`);
        userRef.update({
          'email': value.email,
          'uid': value.uid,
        })
        .then(() => {
            this.router.navigateByUrl('/user-manage');
        })
        .catch(() => {
          userRef.set({
            'displayName': value.displayName,
            'email': value.email,
            'uid': value.uid,
            'photoURL': value.photoURL,
            'role': 'user'
          })
          .then( () => {
            this.router.navigate(['/user-profile', value.uid]);
          })
          .catch((err) => {
            console.log(err);
            alert(err);
          });
        })
      })
      .catch(err => {
        console.log(err)
        alert(err);
      });
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

  deleteAuthCurrentUser(){
    return this.firebaseAuth
    .auth
    .currentUser.delete()
  }

  resetPassword(email: string) {
    return this.firebaseAuth.
     auth.sendPasswordResetEmail(email);
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
      const data = {uid: value.user.uid};
      const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${value.user.uid}`);
      userRef.update(data)
      .then(() => {
        userRef.valueChanges().subscribe((data)=> {
        //if (data.role === 'admin'){
          this.router.navigateByUrl('/user-manage');
        //}else if(data.role === 'user'){this.router.navigate(['/user-profile', data.uid]);}
        });
      })
      .catch(() => {
        userRef.set({
          'displayName': value.user.displayName,
          'email': value.user.email,
          'uid': value.user.uid,
          'photoURL': value.user.photoURL,
          'role': 'user'
        })
        .then( () => {
          alert('Your password may not have been set correctly! To use email/password login method in the future, password reset may be needed')
          this.router.navigate(['/user-profile', value.user.uid]);
          //this.router.navigateByUrl('/user-manage');
        })
        .catch((err) => {
          console.log(err);
          alert(err);
        });
      })
    });
  }
}
