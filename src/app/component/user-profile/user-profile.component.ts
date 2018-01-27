import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { AuthService } from '../../provider/auth.service';
import { Observable } from 'rxjs/Observable';
import { UserInfo } from '../../model/user-info';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DialogComponent } from '../dialog/dialog.component';

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
  uidDialog: string;

  constructor(private afs: AngularFirestore,
              public authService: AuthService, private location: Location,
              private router: Router, private dialog: MatDialog, private route: ActivatedRoute) {

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

  updateUser() {
    if (this.user && this.userInfo) {
      if (this.allRequireFields()) {
        this.afs.collection('users').doc(this.userInfo.uid).update(this.userInfo);
        this.goBack();
      } else {
        alert('Required field was not filled!');
      }
    } else {
      alert('Cannot Update, user not logged in!');
      this.router.navigateByUrl('/login');
    }
  }

  openDialog(userId): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '250px',
      data: 'You are about to delete. Are you sure?'
    });
    this.uidDialog = userId;
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'Confirm') {
        this.deleteUser(this.uidDialog);
      }
    });
  }

  deleteUser(userId) {
    if (this.userInfo) {
      if (this.userInfo.role !== 'admin') {
        this.afs.doc(`users/${userId}`).delete()
        .then(() => {
          if (this.authService.currentUserId === userId) {
            this.authService.deleteAuthCurrentUser();
            this.router.navigateByUrl('/login');
          } else {
            // this.router.navigateByUrl('/user-manage');
            this.goBack()
          }
        });
      } else {
        alert('Admin user cannot be deleted here! Contact system admin');
      }
    }
  }

  allRequireFields() {
    if (this.userInfo.firstName && this.userInfo.lastName) {
      return true;
    }
    return false;
  }

  goBack() {
    this.location.back();
  }

  ngOnInit() {
  }
}
