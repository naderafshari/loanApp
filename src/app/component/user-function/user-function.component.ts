import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../../provider/auth.service';
import { UserInfo } from '../../model/user-info';
import { Form } from '../../model/form';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-user-function',
  templateUrl: './user-function.component.html',
  styleUrls: ['./user-function.component.css']
})
export class UserFunctionComponent implements OnInit, OnDestroy {
 uid: string;
 user: any;
 userInfo: UserInfo;
 sub1: Subscription;
 sub2: Subscription;

  constructor(private afs: AngularFirestore, public authService: AuthService,
    private router: Router, private route: ActivatedRoute ) {
      this.uid = this.authService.currentUserId;
      this.sub1 = this.afs.doc(`users/${this.uid}`).valueChanges()
      .subscribe((data: UserInfo) => this.userInfo = data);
}

  logout() {
    this.authService.logout();
  }

  clickNext() {
    const form = this.afs.collection<Form>('forms', ref => ref.where('formId', '==', 'form1')).valueChanges();
    this.sub2 = form.subscribe((data) => {
      let formData = data[0];
      formData.formCreator = this.userInfo.uid;
      formData.updateTime = new Date().toString();
      formData.startTime = new Date().toString();
      if (this.userInfo.function === 'lender') {
        this.afs.doc(`users/${this.userInfo.uid}`).collection('forms').doc('form1').set(formData);
      } else if (this.userInfo.function === 'borrower') {
        this.afs.doc(`users/${this.userInfo.uid}`).collection('forms').doc(new Date().toString()).set(formData);
      }
      if (this.userInfo) {
        this.userInfo.assignedForms['form1'] = 'true';
        this.afs.collection('users').doc(this.userInfo.uid).update(this.userInfo)
        .then(() =>
          this.router.navigate(['/user-profile', this.userInfo.uid])
        );
      }
    });
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.sub1.unsubscribe();
    this.sub2.unsubscribe();
  }
}
