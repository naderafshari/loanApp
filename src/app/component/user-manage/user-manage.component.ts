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
  userForms: Form[] = [];
  userForm: Form;

  constructor(private afs: AngularFirestore, public fs: FormService,
              public authService: AuthService, private router: Router,
              private route: ActivatedRoute, public dialog: MatDialog) {
  }

  ngOnInit() {
    this.usersCol = this.afs.collection<UserInfo>('users');
    this.users = this.usersCol.valueChanges();
    this.users.subscribe((users) => {
      if (users) {
        users.forEach( (user) => {
          this.afs.doc(`users/${user.uid}`).collection<Form>('forms')
          .valueChanges().subscribe((forms) => {
            if (forms) {
              let formAlreadyPushed;
              for (let i = 1; i <= forms.length; i++) {
                this.userForm = forms.filter(e => e.formId === `form${i}`).reverse()[0];
                if (this.userForm) {
                  this.userForms.forEach((form) => {
                    formAlreadyPushed = false;
                    if (form.formId === `form${i}`) {
                      formAlreadyPushed = true;
                    }
                  });
                  if (!formAlreadyPushed && user.assignedForms[`form${i}`] === 'true') {
                    this.userForm.uid = user.uid;
                    this.userForms.push( this.userForm);
                  }
                }
              }
            }
          });
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
