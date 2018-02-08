import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DialogComponent } from '../dialog/dialog.component';
import { AuthService } from '../../provider/auth.service';
import { UserInfo } from '../../model/user-info';
import { Form } from '../../model/form';
import { NameFilterPipe } from '../../pipe/name-filter.pipe';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-borrower-portal',
  templateUrl: './borrower-portal.component.html',
  styleUrls: ['./borrower-portal.component.css']
})
export class BorrowerPortalComponent implements OnInit, OnDestroy {
  forms: Observable<{}>;
  userForms: any[];
  userForm: any;
  usedForms: string[];
  searchText: any;
  sub1: Subscription;
  sub2: Subscription;
  userInfo: UserInfo;

  constructor(private afs: AngularFirestore,
              public authService: AuthService,
              private router: Router,
              private route: ActivatedRoute ) {
  }

  ngOnInit() {
    this.sub1 = this.afs.doc(`users/${this.authService.currentUserId}`)
    .valueChanges().subscribe((user: UserInfo) => {
      if (user) {
        this.userInfo = user;
      }
    });
    this.sub2 = this.afs.doc(`users/${this.authService.currentUserId}`).collection<Form>('forms')
    .valueChanges().subscribe((forms) => {
      if (forms) {
        this.usedForms = [];
        for (let i = 0; i < forms.length; i++) {
          // find given forms, only once though
          if (this.usedForms.indexOf(forms[i].formId) === -1) {
            this.usedForms.push(forms[i].formId);
          }
        }
        this.userForms = [];
        this.usedForms.forEach( e => {
          /* Find the latest of each formId and push it to userForms array */
          this.userForm = forms.filter(form => form.formId === e).sort(this.compareTime)[0];
          if (this.userForm) {
            this.userForms.push( this.userForm);
          }
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

  goToForm(uid, formId) {
    this.router.navigate(['/form', uid, formId]);
  }

  ngOnDestroy() {
    if (this.sub1) {
      this.sub1.unsubscribe();
    }
    if (this.sub2) {
      this.sub2.unsubscribe();
    }
  }
}
