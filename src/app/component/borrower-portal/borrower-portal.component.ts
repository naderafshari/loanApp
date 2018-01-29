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
    this.afs.collection<Form>('forms')
    .valueChanges().subscribe((definedForms) => {
      if (definedForms) {
        this.usedForms = [];
        for (let i = 0; i < definedForms.length; i++) {
          this.usedForms.push(definedForms[i].formId);
        }
        this.sub1 = this.afs.doc(`users/${this.authService.currentUserId}`).valueChanges()
        .subscribe((data: UserInfo) => {
          this.userInfo = data;
          if (this.userInfo) {
            this.userForms = [];
            this.sub2 = this.afs.doc(`users/${this.userInfo.uid}`).collection<Form>('forms')
            .valueChanges().subscribe((forms) => {
              if (forms) {
                this.usedForms.forEach( e => {
                  /* Find the latest of each form (user's forms collection) and
                    * push it to userForms array if the form is assigned */
                  this.userForm = forms.filter(form => form.formId === e).sort(this.compare)[0];
                  if (this.userForm) {
                    if (this.userInfo.assignedForms[e] === 'true') {
                      this.userForms.push( this.userForm);
                    }
                  }
                });
              }
            // console.log("user forms are: ", this.userForms);
            });
          }
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

  goToForm(uid, formId) {
    this.router.navigate(['/form', uid, formId]);
  }

  ngOnDestroy() {
    this.sub1.unsubscribe();
    this.sub2.unsubscribe();
  }
}
