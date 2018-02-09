import { Component, Inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DialogComponent } from '../dialog/dialog.component';
import { AuthService } from '../../provider/auth.service';
import { UserInfo } from '../../model/user-info';
import { Form } from '../../model/form';
import { FormManageComponent } from '../form-manage/form-manage.component';
import { NameFilterPipe } from '../../pipe/name-filter.pipe';

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
  forms: Observable<{}>;
  userForms: any[];
  userForm: any;
  usedForms: string[];
  searchText: any;

  constructor(private afs: AngularFirestore, public dialog: MatDialog,
              public authService: AuthService, private router: Router,
              private route: ActivatedRoute ) {
  }

  ngOnInit() {
    this.usersCol = this.afs.collection<UserInfo>('users');
    this.users = this.usersCol.valueChanges();
    this.userForms = [];
    this.users.subscribe((users) => {
      if (users) {
        users.forEach( user => {
          const sub0 = this.afs.doc(`users/${user.uid}`).collection<Form>('forms')
          .valueChanges().subscribe((forms) => {
            if (forms) {
              this.usedForms = [];
              for (let i = 0; i < forms.length; i++) {
                // find given forms, only once though
                if (this.usedForms.indexOf(forms[i].formId) === -1) {
                  this.usedForms.push(forms[i].formId);
                }
              }
              this.usedForms.forEach( e => {
                /* Find the latest of each form of each user and push it to userForms array
                 * along with the uid of the user if the form is assigned */
                this.userForm = forms.filter(form => form.formId === e && user.assignedForms[e])
                .sort(this.compareTime)[0];
                if (this.userForm) {
                  this.userForm.uid = user.uid;
                  this.userForms.push(this.userForm);
                }
              });
            }
          });
        });
      }
    });
  }

  compareTime(a, b) {
    if (a.updateTime < b.updateTime) {
      return -1;
    }
    if (a.updateTime > b.updateTime) {
      return 1;
    }
    return 0;
  }

  editClick(uid) {
    this.router.navigate(['/user-profile', uid]);
  }

  logout() {
    this.authService.logout();
  }

  goFormManage(uid) {
    this.router.navigate(['/form-manage', uid]);
  }

  goLenderFormManage(uid) {
    this.router.navigate(['/lender-form-manage', uid]);
  }

  goFormAssign(uid) {
    this.router.navigate(['/form-assign', uid]);
  }

  goToForm(uid, formId) {
    this.router.navigate(['/form', uid, formId]);
  }

  goFormHistory(uid) {
    this.router.navigate(['/form-history', uid]);
  }
}
