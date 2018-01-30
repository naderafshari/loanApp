import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { AngularFirestore } from 'angularfire2/firestore';
import { AuthService } from '../../provider/auth.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { UserInfo } from '../../model/user-info';

@Component({
  selector: 'app-email-change',
  templateUrl: './email-change.component.html',
  styleUrls: ['./email-change.component.css']
})
export class EmailChangeComponent implements OnInit {
  email: string;
  password: string;
  userDoc: Observable<{}>;
  user: any;
  userInfo: UserInfo;

  constructor(public authService: AuthService, private router: Router,
    private location: Location, private afs: AngularFirestore) {
      this.userDoc = this.afs.doc(`users/${this.authService.currentUserId}`).valueChanges();
      this.userDoc.subscribe((data: UserInfo) => {
        this.userInfo = data;
      });
  }

  changeEmail(formData) {
    if (formData.valid) {
      this.authService.changeEmail(formData.value.newEmail, this.userInfo.email, formData.value.password);
      this.userInfo.email = formData.value.newEmail;
      this.afs.doc(`users/${this.authService.currentUserId}`).update(this.userInfo);
      this.goBack();
    }
  }

  goBack() {
    this.location.back();
  }

  ngOnInit() {
  }
}
