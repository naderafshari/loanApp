import { Injectable } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { Form, FormClass } from '../model/form';
import { FormConfigComponent } from '../component/form-config/form-config.component';
import { UserInfo } from '../model/user-info';

@Injectable()
export class FormService {

  formsCol: AngularFirestoreCollection<Form>;
  userDoc: AngularFirestoreDocument<Form>;
  forms: Observable<Form[]>;

  constructor(private afs: AngularFirestore,
    private router: Router,
    private route: ActivatedRoute) {
      this.formsCol = this.afs.collection<Form>('forms');
      this.forms = this.formsCol.valueChanges();
      /*this.forms = this.formsCol.snapshotChanges().map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data() as Form;
          const id = a.payload.doc.id;
          return {id, ...data};
        });
      });*/
    }

  getForms() {
    return this.forms;
  }

  getForm(id) {
    return this.afs.doc<Form>(`forms/${id}`).valueChanges();
  }

  deleteForm(id) {
    const formsRef: AngularFirestoreDocument<any> = this.afs.doc(`forms/${id}`);
    formsRef.delete().then(() => console.log(`${id} deleted`));
  }

  addForm(i) {
    const formClass: FormClass = new FormClass();
    const formsRef: AngularFirestoreDocument<any> = this.afs.doc(`forms/form${i}`);
    const form: Form = formClass.form;
    form.formId = `form${i}`;
    form.formName = `form${i}`;
    form.updateTime = new Date().toString();
    form.startTime = new Date().toString();
    formsRef.set(form).then(() => console.log(`form${i} added`));
  }

  createAllForms() {
    const formClass: FormClass = new FormClass();
    for (let i = 1; i <= 10; i++) {
      const formsRef: AngularFirestoreDocument<any> = this.afs.doc(`forms/form${i}`);
      const form: Form = formClass.form;
      form.formId = `form${i}`;
      form.formName = `form${i}`;
      form.updateTime = new Date().toString();
      form.startTime = new Date().toString();
      formsRef.set(form).then(() => console.log(`forms${i} added`));
    }
  }
  
  assignForm(formId, uid) {
    const form = this.afs.collection<Form>('forms', ref => ref.where('formId', '==', formId)).valueChanges();
    const sub1 = form.subscribe((data) => {
        let formData = data[0];
        formData.updateTime = new Date().toString();
        formData.startTime = new Date().toString();
        this.afs.doc(`users/${uid}`).collection('forms').doc(new Date().toString()).set(formData);
        sub1.unsubscribe();
     });
     const user = this.afs.collection<UserInfo>('users', ref => ref.where('uid', '==', uid)).valueChanges();
     const sub2 = user.subscribe((data) => {
       const userInfo = data[0];
       if (userInfo) {
         userInfo.assignedForms[`${formId}`] = 'true';
         this.afs.collection('users').doc(userInfo.uid).update(userInfo);
       }
       sub2.unsubscribe();
      });
  }

  unAssignForm(formId, uid) {
    const user = this.afs.collection<UserInfo>('users', ref => ref.where('uid', '==', uid)).valueChanges();
    const sub2 = user.subscribe((data) => {
      const userInfo = data[0];
      if (userInfo) {
        userInfo.assignedForms[`${formId}`] = 'false';
        this.afs.collection('users').doc(userInfo.uid).update(userInfo);
      }
      sub2.unsubscribe();
     });
  }

  reAssignFormAllUsers(formId) {
    const user = this.afs.collection<UserInfo>('users').valueChanges();
    const sub2 = user.subscribe((data) => {
      const users = data;
      users.forEach((userInfo) =>  {
        if (userInfo.assignedForms[`${formId}`] == 'true') {
          const form = this.afs.collection<Form>('forms', ref => ref.where('formId', '==', formId)).valueChanges();
          const sub1 = form.subscribe((data) => {
              let formData = data[0];
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
