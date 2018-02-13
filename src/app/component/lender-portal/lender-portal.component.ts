import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
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
  selector: 'app-lender-portal',
  templateUrl: './lender-portal.component.html',
  styleUrls: ['./lender-portal.component.css']
})
export class LenderPortalComponent implements OnInit, OnDestroy {
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
  inbox = false;
  show_inbox_icon = false;


  constructor(private afs: AngularFirestore, public dialog: MatDialog,
              public authService: AuthService, private router: Router,
              private route: ActivatedRoute ) {
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
            .where('formCreator', '==', this.userInfo.uid)).valueChanges()
            .subscribe((forms) => {
              if (forms) {
                const sub2 = this.afs.doc<UserInfo>(`users/${userId}`).valueChanges().subscribe((user) => {
                  this.users.push(user);
                  this.usedForms.forEach( e => {
                    /* Find the latest of each form of each user and push it to userForms array */
                    this.userForm = forms.filter(form => form.formId === e).sort(this.compareTime)[0];
                    if (this.userForm) {
                      if (user.assignedForms[e] === this.userInfo.uid) {
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

  show_inbox() {
  	this.inbox = true;
    this.show_inbox_icon = true;
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

  goInterestArea(uid) {
    alert('Comming soon!');
  }

  viewBorrowers() {
    this.router.navigateByUrl('/lender-prospect-view');
  }

  goFormManage(uid) {
    this.router.navigate(['/lender-form-manage', uid]);
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

  goToCart(uid) {
    this.router.navigate(['/lender-cart', uid]);
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }
}
