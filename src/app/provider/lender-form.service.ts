import { Injectable } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { Form, FormClass } from '../model/form';
import { FormConfigComponent } from '../component/form-config/form-config.component';
import { UserInfo } from '../model/user-info';
import { AuthService } from './auth.service';

@Injectable()
export class LenderFormService {

  formsCol: AngularFirestoreCollection<Form>;
  forms: Observable<Form[]>;

  constructor(private afs: AngularFirestore, private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute) {
      this.formsCol = this.afs.doc(`users/${this.authService.currentUserId}`).collection<Form>('forms');
      this.forms = this.formsCol.valueChanges();
    }

  getForms() {
    return this.forms;
  }

  getForm(id) {
    return this.formsCol.doc<Form>(`${id}`).valueChanges();
  }

  deleteForm(id) {
    const formsRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${this.authService.currentUserId}/forms/${id}`);
    // const formsRef: AngularFirestoreDocument<any> =  this.formsCol.doc(`${id}`);
    formsRef.delete().then(() => console.log(`${id} deleted`));
  }

  addForm(i) {
    const formClass: FormClass = new FormClass();
    const formsRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${this.authService.currentUserId}/forms/form${i}`);
    const form: Form = formClass.form;
    form.formId = `form${i}`;
    form.formName = `form${i}`;
    form.updateTime = new Date().toString();
    form.startTime = new Date().toString();
    formsRef.set(form).then(() => console.log(`form${i} added`));
  }

  assignForm(formId, uid) {
    const form = this.afs.doc(`users/${this.authService.currentUserId}`)
    .collection<Form>('forms', ref => ref.where('formId', '==', formId)).valueChanges();
    const sub1 = form.subscribe((data) => {
        let formData = data[0];
        formData.formCreator = this.authService.currentUserId;
        formData.updateTime = new Date().toString();
        formData.startTime = new Date().toString();
        this.afs.doc(`users/${uid}`).collection('forms').doc(new Date().toString()).set(formData);
        sub1.unsubscribe();
     });
     const user = this.afs.collection<UserInfo>('users', ref => ref.where('uid', '==', uid)).valueChanges();
     const sub = user.subscribe((data) => {
       const userInfo = data[0];
       if (userInfo) {
         userInfo.assignedForms[`${formId}`] = 'true';
         this.afs.collection('users').doc(userInfo.uid).update(userInfo);
       }
       sub.unsubscribe();
      });
  }

  unAssignForm(formId, uid) {
    const user = this.afs.collection<UserInfo>('users', ref => ref.where('uid', '==', uid)).valueChanges();
    const sub = user.subscribe((data) => {
      const userInfo = data[0];
      if (userInfo) {
        userInfo.assignedForms[`${formId}`] = 'false';
        this.afs.collection('users').doc(userInfo.uid).update(userInfo);
      }
      sub.unsubscribe();
     });
  }

  reAssignFormAllUsers(formId, uid) {
    const user = this.afs.doc(`users/${this.authService.currentUserId}`)
    .collection<UserInfo>('users').valueChanges();
    const sub2 = user.subscribe((data) => {
      const users = data;
      users.forEach((userInfo) =>  {
        if (userInfo.assignedForms[`${formId}`] === 'true') {
          const form = this.afs.doc(`users/${this.authService.currentUserId}`)
          .collection<Form>('forms', ref => ref.where('formId', '==', formId)).valueChanges();
          const sub1 = form.subscribe((data) => {
              let formData = data[0];
              formData.formCreator = uid;
              formData.updateTime = new Date().toString();
              formData.startTime = new Date().toString();
              this.afs.doc(`users/${userInfo.uid}`).collection('forms').doc(new Date().toString()).set(formData);
              sub1.unsubscribe();
          });
        }
      });
      sub2.unsubscribe();
    });
  }

}
