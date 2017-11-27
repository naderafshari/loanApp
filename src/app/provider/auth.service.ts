import { async } from '@angular/core/testing';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AuthInfo } from "./auth-info";
import * as firebase from 'firebase/app';
import { Observable, Subject, BehaviorSubject } from 'rxjs/Rx';
import {Router} from "@angular/router";

@Injectable()
export class AuthService {
  user: Observable<firebase.User>;
  static UNKNOWN_USER = new AuthInfo(null);
  authInfo$: BehaviorSubject<AuthInfo> = new BehaviorSubject<AuthInfo>(AuthService.UNKNOWN_USER);
  
  constructor(private firebaseAuth: AngularFireAuth, private router:Router) {
    this.user = firebaseAuth.authState;
  }
  /*
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
    get currentUserId(): string {
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
      .createUserWithEmailAndPassword(email, password);
      /*.then(value => {
        console.log('Success!', value);
      })
      .catch(err => {
        console.log('Something went wrong:',err.message);
      });*/    
  }

  login(email: string, password: string) {
    return this.firebaseAuth
      .auth
      .signInWithEmailAndPassword(email, password);
      //.then(value => {
      //  console.log('Nice, it worked!');
      //})
      //.catch(err => {
      //  console.log('Something went wrong:',err.message);
      //});
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
    .then(
      () => {
        console.log("login success")
        this.user = this.firebaseAuth.authState;
        this.router.navigateByUrl('/user-profile');        
      }
    )
    .catch((error) => {
        console.log(error)
        error => alert(error)
      }
    )
  }

}
