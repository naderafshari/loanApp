import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { AuthService } from '../../provider/auth.service';
import { Observable } from 'rxjs/Observable';
import { UserInfo } from '../../model/user-info';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
})

export class UserProfileComponent implements OnInit {
  userDoc: Observable<{}>;
  user: any;
  userInfo: UserInfo;
  uid: string;

  constructor(private afs: AngularFirestore,
              public authService: AuthService,
              private router: Router,
              private route: ActivatedRoute) {

    this.route.params.subscribe(params => {
      this.uid = params['uid'] || 0;
      authService.user.subscribe((user) => {
        this.user = user;
        if (user) {
          if (this.uid) {
            this.userDoc = this.afs.doc(`users/${this.uid}`).valueChanges();
          } else {
            this.userDoc = this.afs.doc(`users/${this.user.uid}`).valueChanges();
          }
          this.userDoc.subscribe((data: UserInfo) => this.userInfo = data);
        }
      });
    });
  }

  ngOnInit() {
  }

  updateUser() {
    if (this.user != null && this.userInfo != null) {
      this.afs.collection('users').doc(this.userInfo.uid).update(this.userInfo);
      this.router.navigateByUrl('/user-manage');
    } else {
      alert('Cannot Update, user not logged in!');
      this.router.navigateByUrl('/login');
    }
  }

  logout() {
    this.authService.logout();
  }
}
