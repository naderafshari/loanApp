import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';   
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { AuthService } from '../../provider/auth.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { userInfo } from 'os';

interface UserInfo {
  displayName: string,
  email: string,
  firstName: string,
  lastName: string
}

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
})

export class UserProfileComponent implements OnInit {
  usersCol: AngularFirestoreCollection<UserInfo>;
  usersDoc: Observable<UserInfo[]>;
  userDoc: Observable<{}>;
  user: any;
  userInfo: UserInfo;

  constructor(private afs: AngularFirestore, public authService: AuthService, private router:Router) { 
    this.user = authService.user.subscribe(
      //google login would not have the user updated when redirected to this page
      //when subscribing to the user is updated when observer is fired 
      () => {
        this.user = this.authService.currentUserInfo
        if (this.user)
        {
          this.usersCol = this.afs.collection('users');
          this.usersDoc = this.usersCol.valueChanges();
          this.userDoc = this.usersCol.doc(this.user.uid).valueChanges();
          this.userDoc.subscribe((data: UserInfo) => {
            this.userInfo = data;
          });//doc observer
        }//if user
      });//user observer
}

  ngOnInit() {
}
  
  updateUser() {
    if (this.user != null && this.userInfo != null) {
      console.log('User:', this.user.uid);
      this.afs.collection('users').doc(this.user.uid).set({ 
        'displayName': this.user.displayName, 
        'email': this.user.email,
        'firstName': this.userInfo.firstName,
        'lastName': this.userInfo.lastName
      });  
    }
    else{
      console.log('Cannot Update, user not logged in!');
      this.router.navigateByUrl('/login');
    }
  }

  logout() {
    this.authService.logout()
    .then(
      () => {
              //alert('User logged out successfully!');
              this.router.navigateByUrl('/login');
      },
      err => alert(err)
    );
  }
}
