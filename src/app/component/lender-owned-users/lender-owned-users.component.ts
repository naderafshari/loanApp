import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DatePipe, Location } from '@angular/common';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/map';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DialogComponent } from '../dialog/dialog.component';
import { AuthService } from '../../provider/auth.service';
import { UserInfo } from '../../model/user-info';
import { Form } from '../../model/form';
import { FormManageComponent } from '../form-manage/form-manage.component';
import { NameFilterPipe } from '../../pipe/name-filter.pipe';

@Component({
  selector: 'app-lender-owned-users',
  templateUrl: './lender-owned-users.component.html',
  styleUrls: ['./lender-owned-users.component.css']
})
export class LenderOwnedUsersComponent implements OnInit, OnDestroy {
  usersCol: AngularFirestoreCollection<UserInfo>;
  userDoc: AngularFirestoreDocument<UserInfo>;
  users: any;
  forms: Observable<{}>;
  userForms: any[];
  userForm: any;
  usedForms: string[];
  searchText: any;
  userInfo: UserInfo;
  purchasedUsers: any[];
  sub: Subscription;

  constructor(private afs: AngularFirestore, public dialog: MatDialog,
              public authService: AuthService, private router: Router,
              private route: ActivatedRoute, private location: Location ) {
  }

  ngOnInit() {
    this.sub = this.afs.doc<UserInfo>(`users/${this.authService.currentUserId}`)
    .valueChanges().subscribe((data) => {
      this.userInfo = data;
      this.purchasedUsers = [];
      if (typeof this.userInfo.purchased !== 'undefined' && this.userInfo.purchased.length > 0 ) {
        // If use object instead of array use this code..
        // if (this.userInfo.purchased) {
          // this.purchasedUsers = Object.values(this.userInfo.purchased);
        // }
        this.purchasedUsers = this.userInfo.purchased;
      }
// console.log('purchased users values: ', this.purchasedUsers);
      const sub0 = this.afs.doc(`users/${this.userInfo.uid}`).collection<Form>('forms')
      .valueChanges().subscribe((definedForms) => {
        if (definedForms) {
          this.usedForms = [];
          for (let i = 0; i < definedForms.length; i++) {
            // find given forms, only once though which is not really needed because there should only be
            // one instanse of a form in the lender form collection
            if (this.usedForms.indexOf(definedForms[i].formId) === -1) {
              this.usedForms.push(definedForms[i].formId);
            }
          }
// console.log('defined forms are: ', this.usedForms);
          this.users = [];
          this.userForms = [];
          this.purchasedUsers.forEach( userId => {
            const sub1 = this.afs.doc(`users/${userId}`).collection<Form>('forms', ref => ref
            // this line is for when lender creats forms and we only want to get the forms that belongs to this lender
            // .where('formCreator', '==', this.userInfo.uid))
            .where('formName', '==', 'auto'))
            .valueChanges()
            .subscribe((forms) => {
              if (forms) {
// console.log('forms are: ', forms)
                const sub2 = this.afs.doc<UserInfo>(`users/${userId}`).valueChanges().subscribe((user) => {
                  this.users.push(user);
                  this.usedForms.forEach( e => {
                    /* Find the latest of each form of each user and push it to userForms array */
                    this.userForm = forms.filter(form => form.formId === e).sort(this.compareTime)[0];
                    if (this.userForm) {
// console.log('userForm is: ', this.userForm)
                      if (user.assignedForms[e] === this.userInfo.uid || user.assignedForms[e] === userId) {
                        this.userForm.uid = userId;
                        this.userForms.push(this.userForm);
                      }
                    }
                  });
                  sub2.unsubscribe();
                });
                sub1.unsubscribe();
              }
            });
          });
          sub0.unsubscribe();
        }
      });
    });
  }

  compareTime(a, b) {
    if (Date.parse(a.updateTime) < Date.parse(b.updateTime)) {
      return 1;
    }
    if (Date.parse(a.updateTime) > Date.parse(b.updateTime)) {
      return -1;
    }
    return 0;
  }

  editClick(uid) {
    this.router.navigate(['/user-profile', uid]);
  }

  goBack() {
    this.location.back();
  }

  openRemoveDialog(uid): void {
    if (this.authService.userFunction === 'lender' ||
        this.authService.userAuthRole === 'admin') {
      const dialogRef = this.dialog.open(DialogComponent, {
        width: '250px',
        data: 'You are about to remove an Acquired Applicant! To re-acquire, re-purchase is needed. Are you sure?'
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result === 'Confirm') {
          this.removeApplicant(uid);
        }
      });
    } else {
      alert('No Delete privilages! Please contact the Administrator');
    }
  }

  removeApplicant(uid) {
    if (uid) {
      this.userInfo.purchased = this.userInfo.purchased.filter( e => e !== uid);
      this.afs.doc(`users/${this.userInfo.uid}`).update(this.userInfo);
    }
  }

  goFormAssign(uid) {
    this.router.navigate(['/lender-form-assign', uid]);
  }

  goToForm(uid, formId) {
    this.router.navigate(['/form', uid, formId]);
  }

  goFormHistory(uid) {
    this.router.navigate(['/lender-form-history', uid]);
  }

  goMsgCompose(uid) {
    this.router.navigate(['/msg-compose', uid, '']);
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }
}
