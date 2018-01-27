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
import { userInfo } from 'os';

@Component({
  selector: 'app-lender-portal',
  templateUrl: './lender-portal.component.html',
  styleUrls: ['./lender-portal.component.css']
})
export class LenderPortalComponent implements OnInit {
  usersCol: AngularFirestoreCollection<UserInfo>;
  userDoc: AngularFirestoreDocument<UserInfo>;
  users: Observable<UserInfo[]>;
  forms: Observable<{}>;
  userForms: any[];
  userForm: any;
  usedForms: string[];
  searchText: any;
  userInfo: UserInfo;
  ownedUsers: any[];

  constructor(private afs: AngularFirestore, public dialog: MatDialog,
              public authService: AuthService, private router: Router,
              private route: ActivatedRoute ) {
  }

  ngOnInit() {
    this.afs.doc<UserInfo>(`users/${this.authService.currentUserId}`)
    .valueChanges().subscribe((data)=> {
      this.userInfo = data;
      this.ownedUsers = [];
      if (this.userInfo.owned) {
        this.ownedUsers = Object.values(this.userInfo.owned);
      }
      console.log('owned users values: ', this.ownedUsers)
    });
    this.afs.doc(`users/${this.authService.currentUserId}`).collection<Form>('forms')
    .valueChanges().subscribe((definedForms) => {
      if (definedForms) {
        this.usedForms = [];
        for (let i = 0; i < definedForms.length; i++) {
          this.usedForms.push(definedForms[i].formId);
        }
        console.log("defined forms are: ", this.usedForms);
        this.userForms = [];
        this.ownedUsers.forEach( userId => {
              this.afs.collection<UserInfo>('users');
              this.afs.doc(`users/${userId}`).collection<Form>('forms', ref => ref.where('formSource', '==', this.userInfo.uid))
              .valueChanges().subscribe((forms) => {
                if (forms) {
                  this.usedForms.forEach( e => {
                    /* Find the latest of each form of each user ( user's forms collection )and
                     * push it to userForms array along with the uid of the user if the form is assigned */
                    this.userForm = forms.filter(form => form.formId === e).sort(this.compare)[0];
                    if (this.userForm) {
                        this.userForms.push( this.userForm);
                    }
                  });
                }
                console.log("user forms are: ", this.userForms);
              });
        });
      }
    });
  }

  compare(a, b) {
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
