import { subscribeOn } from 'rxjs/operator/subscribeOn';
import { async } from '@angular/core/testing';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Observable, Subject, BehaviorSubject } from 'rxjs/Rx';
import { Router } from "@angular/router";
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { UserAuth, UserAuthInfo, Roles } from './user-info'

@Injectable()
export class AuthService {

  user: Observable<UserAuthInfo>;
  userDoc: Observable<{}>;
  //userRoles: Array<string>; // roles of currently logged in uer
  userRoles: Roles;
  userAuthInfo: UserAuthInfo;
  
  constructor(private firebaseAuth: AngularFireAuth, private router:Router, private afs: AngularFirestore) {
    
    this.user = this.firebaseAuth.authState
    .switchMap(user => {
      if (user) {
          this.userDoc = this.afs.doc(`users-auth/${user.uid}`).valueChanges();
          this.userDoc.subscribe((data: UserAuthInfo) => {
            this.userAuthInfo = data;
            console.log('Role is: ',this.userAuthInfo.roles);
          });
          return this.afs.doc<UserAuthInfo>(`users-auth/${user.uid}`).valueChanges()
      } else {
        return Observable.of(null)
      }
    })
  }

  private updateUserAuthData(userAuth) {
    // Sets user data to firestore on login
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users-auth/${userAuth.uid}`);
    const data: UserAuthInfo = {
      uid: userAuth.uid,
      email: userAuth.email,
      displayName: userAuth.displayName,
      photoURL: userAuth.photoURL,
      roles: { author: true, reader: false, admin: false }
    }
    return userRef.snapshotChanges()
    .map(action => action.payload.exists)
    .subscribe(exists => exists ? userRef.update(data) : userRef.set(data));
  }

  private updateUserData(user) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);
    const userData = {email: user.email, displayName: user.displayName};
    userRef.update(userData)
    .then( () => {
      this.firebaseAuth.authState.subscribe( () =>
        this.router.navigateByUrl('/user-profile'))
    })
    .catch ( () => {
      userRef.set(userData).then( () => {
        this.router.navigateByUrl('/user-profile');
      })
    })
    //return userRef.snapshotChanges()
    //.map(action => action.payload.exists)
    //.subscribe(exists => exists ? userRef.update(userData) : userRef.set(userData));
  }

  // Returns true if user is logged in
    get authenticated(): boolean {
//      return this.firebaseAuth.authState !== null;
      return this.user !== null;
    }

    //get userAuthRoles(): Roles {
    //  const userRoles = this.user
    //  .map( (user) => this.userRoles = user.roles);
    //  return this.userRoles;
    //}
  
    // Returns current user data
    get currentUser(): any {
//      return this.authenticated ? this.firebaseAuth.authState : null;
      return this.authenticated ? this.user : null;
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
        this.updateUserAuthData(value);
        this.updateUserData(value);
        this.user.subscribe( () =>
          this.router.navigateByUrl('/user-profile'));
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
        this.user.subscribe( () =>
          this.router.navigateByUrl('/user-profile'));
    })
      .catch((error) => {
        console.log(error)
        alert(error);
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
      .catch(
        err => {
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
        this.updateUserAuthData(value.user);        
        this.afs.collection('users').doc(this.currentUserId).update({
            'displayName': value.user.displayName
        })
        .then( () => {
          this.firebaseAuth.authState.subscribe( () =>
            this.router.navigateByUrl('/user-profile'))
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
