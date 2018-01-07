import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { AuthService } from '../../provider/auth.service';
import { UserInfo } from '../../model/user-info';
import { Observable } from 'rxjs/Observable';
import { Form } from '../../model/form';
import { FormService } from '../../provider/form.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-form-assign',
  templateUrl: './form-assign.component.html',
  styleUrls: ['./form-assign.component.css']
})
export class FormAssignComponent implements OnInit {
  uid: string;
  forms: Observable<Form[]>;
  formData: Form;
  userDoc: Observable<{}>;
  user: any;
  userInfo: UserInfo;
  sub: Subscription;

  constructor(private afs: AngularFirestore,
              private router: Router,
              private route: ActivatedRoute,
              public fs: FormService) {
    this.route.params.subscribe(params => {
      this.uid = params['uid'] || 0;
      if (this.uid) {
        this.forms = this.fs.getForms();
        this.userDoc = this.afs.doc(`users/${this.uid}`).valueChanges();
        this.sub = this.userDoc.subscribe((data: UserInfo) => this.userInfo = data);
      }
    });
  }

  assignClick(formId) {
    const form = this.afs.collection<Form>('forms', ref => ref.where('formId', '==', formId)).valueChanges();
    const sub = form.subscribe((data) => {
        this.formData = data[0];
        this.formData.updateTime = new Date().toString();
        this.formData.startTime = new Date().toString();
        this.afs.doc(`users/${this.uid}`).collection('forms').doc(new Date().toString()).set(this.formData);
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
    if (this.userInfo) {
      this.userInfo.assignedForms[`${formId}`] = 'false';
      this.afs.collection('users').doc(this.userInfo.uid).update(this.userInfo);
      this.sub.unsubscribe();
      alert('Form Unassigned successfully.');
      this.router.navigateByUrl('/user-manage');
    }
  }

  ngOnInit() {
  }

}
