import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { AuthService } from '../../provider/auth.service';
import { UserInfo } from '../../model/user-info';
import { Observable } from 'rxjs/Observable';
import { Form } from '../../model/form';
import { FormService } from '../../provider/form.service';

@Component({
  selector: 'app-form-assign',
  templateUrl: './form-assign.component.html',
  styleUrls: ['./form-assign.component.css']
})
export class FormAssignComponent implements OnInit {
  uid: string;
  forms: Observable<Form[]>;
  formsArray: Form[];
  userDoc: Observable<{}>;
  user: any;
  userInfo: UserInfo;

  constructor(private afs: AngularFirestore,
              private router: Router,
              private route: ActivatedRoute,
              public fs: FormService) {
    this.route.params.subscribe(params => {
      this.uid = params['uid'] || 0;
      if (this.uid) {
        this.forms = this.fs.getForms();
        // console.log(this.forms);
        if (this.uid) {
          this.userDoc = this.afs.doc(`users/${this.uid}`).valueChanges();
          this.userDoc.subscribe((data: UserInfo) => this.userInfo = data);
        }
      }
    });
  }

  assignClick(formId) {
    const form = this.afs.collection<Form>('forms', ref => ref.where('formId', '==', formId)).valueChanges();
    const sub = form.subscribe((data) => {
        this.formsArray = data;
        this.formsArray[0].updateTime = new Date().toString();
        this.formsArray[0].startTime = new Date().toString();
        this.afs.doc(`users/${this.uid}`).collection('forms').doc(new Date().toString()).set(this.formsArray[0]);
        if (this.userInfo) {
          this.userInfo.assignedForms[`${formId}`] = 'true';
          this.afs.collection('users').doc(this.userInfo.uid).update(this.userInfo);
        }
        sub.unsubscribe();
        alert('Form assigned successfully.');
        this.router.navigateByUrl('/user-manage');
    });
  }

  unAssignClick(formId) {
    const user = this.afs.collection<UserInfo>('users', ref => ref.where('uid', '==', this.userInfo.uid)).valueChanges();
    const sub = user.subscribe((data) => {
        this.user = data;
        if (this.user) {
          this.userInfo.assignedForms[`${formId}`] = 'false';
          this.afs.collection('users').doc(this.userInfo.uid).update(this.userInfo);
          sub.unsubscribe();
          alert('Form Unassigned successfully.');
          this.router.navigateByUrl('/user-manage');
        }
    });
  }

  ngOnInit() {
  }

}
