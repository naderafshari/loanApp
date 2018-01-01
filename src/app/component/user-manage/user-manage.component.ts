import { FormService } from './../../provider/form.service';
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

  constructor(private afs: AngularFirestore, public dialog: MatDialog,
              public authService: AuthService, private router: Router,
              private route: ActivatedRoute ) {
  }

  ngOnInit() {
    this.afs.collection<Form>('forms')
    .valueChanges().subscribe((definedForms) => {
      if (definedForms) {
        this.usedForms = [];
        for (let i = 0; i < definedForms.length; i++) {
          this.usedForms.push(definedForms[i].formId);
        }
        this.usersCol = this.afs.collection<UserInfo>('users');
        this.users = this.usersCol.valueChanges();
        this.userForms = [];
        this.users.subscribe((users) => {
          if (users) {
            users.forEach( user => {
              this.afs.doc(`users/${user.uid}`).collection<Form>('forms')
              .valueChanges().subscribe((forms) => {
                if (forms) {
                  this.usedForms.forEach( e => {
                    /* Find the latest of each form of each user ( user's forms collection )and
                     * push it to userForms array along with the uid of the user if the form is assigned */
                    this.userForm = forms.filter(form => form.formId === e).reverse()[0];
                    if (this.userForm) {
                      if (user.assignedForms[e] === 'true') {
                        this.userForm.uid = user.uid;
                        this.userForms.push( this.userForm);
                      }
                    }
                  });
                }
                // console.log(this.userForms);
              });
            });
          }
        });
      }
    });
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
