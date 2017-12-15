import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { AuthService } from '../../provider/auth.service';
import { DialogComponent } from '../dialog/dialog.component';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { UserInfo } from '../../model/user-info';

@Component({
  selector: 'app-user-manage',
  templateUrl: './user-manage.component.html',
  styleUrls: ['./user-manage.component.css']
})
export class UserManageComponent implements OnInit {
  usersCol: AngularFirestoreCollection<UserInfo>;
  userDoc: AngularFirestoreDocument<UserInfo>;
  users: Observable<UserInfo[]>;
  userId: any;

  constructor(private afs: AngularFirestore,
              public authService: AuthService, private router: Router,
              private route: ActivatedRoute, public dialog: MatDialog) {
    this.usersCol = this.afs.collection<UserInfo>('users');
    this.users = this.usersCol.snapshotChanges().map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data() as UserInfo;
        const id = a.payload.doc.id;
        return data;
      });
    });
  }

  openDialog(userId): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '250px',
      data: 'You are about to delete. Are you sure?'
    });
    this.userId = userId;
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'Confirm') {
        this.deleteUser(this.userId);
      }
    });
  }

  deleteUser(userId) {
    this.userDoc = this.afs.doc(`users/${userId}`);
    if (this.userDoc) {
      const sub = this.userDoc.valueChanges().subscribe((data) => {
         if (data) {
          if (data.role !== 'admin') {
            console.log('Deleting User');
            this.userDoc.delete()
            .then(() => {
              sub.unsubscribe();
              if (this.authService.currentUserId === userId) {
                this.authService.deleteAuthCurrentUser();
                this.router.navigateByUrl('/login');
              }
            });
          } else {
            alert('Admin user cannot be deleted here! Contact system admin');
          }
        }
      });
    }
  }

  editClick(uid) {
    this.router.navigate(['/user-profile', uid]);
  }

  logout() {
    this.authService.logout();
  }

  ngOnInit() {
  }

}
