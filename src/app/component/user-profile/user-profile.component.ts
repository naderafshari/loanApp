import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';   
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { AuthService } from '../../provider/auth.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

interface UserInfo {
  displayName: string;
  email: string;
  firstName: string;
  lastName: string;
}

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
})

export class UserProfileComponent implements OnInit {
  usersCol: AngularFirestoreCollection<UserInfo>;
  usersDoc: Observable<UserInfo[]>;
  user: any;
  firstName: string;

  constructor(private afs: AngularFirestore, public authService: AuthService, private router:Router) { 
    this.user = authService.user.subscribe(
      //google login would not have the user updated when redirected to this page
      //when subscribing to the user is updated when observer is fired 
      () => {
        this.user = this.authService.currentUserInfo
      }
    );
  }

  ngOnInit() {
    this.usersCol = this.afs.collection('users');
    this.usersDoc = this.usersCol.valueChanges();
}
  
  updateUser() {
    if (this.user != null) {
      console.log('User:', this.user.uid);
      this.afs.collection('users').doc(this.user.uid).set({ 
        'displayName': this.user.displayName, 
        'email': this.user.email,
        'firstname': this.firstName
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
