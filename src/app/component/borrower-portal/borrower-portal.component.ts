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
import { Message } from '../../model/message';
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
  sub3: Subscription;
  userInfo: UserInfo;
  inbox = false;
  show_inbox_icon = false;
  portal = true;
  show_portal_icon = true;
  messages: Message[];
  unreadMsgCount: number;

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
    this.sub3 = this.afs.collection<Message>('messages', ref => ref.where('rid', '==', this.authService.currentUserId))
    .valueChanges().subscribe((data) => {
      this.messages = data;
      this.unreadMsgCount = this.messages.filter(e => !e.opened).length;
    });
}

  goToInbox() {
    this.router.navigateByUrl('/msg-inbox');
  }

  show_inbox() {
    this.inbox = true;
    this.show_inbox_icon = true;
    this.portal = false;
    this.show_portal_icon = false;
  }

  show_portal() {
    this.inbox = false;
    this.show_inbox_icon = false;
    this.portal = true;
    this.show_portal_icon = true;
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
    if (this.sub3) {
      this.sub3.unsubscribe();
    }
  }
}
