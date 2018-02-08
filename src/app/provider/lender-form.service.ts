import { Injectable } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { Form, FormClass } from '../model/form';
import { FormConfigComponent } from '../component/form-config/form-config.component';
import { UserInfo } from '../model/user-info';
import { AuthService } from './auth.service';
import { UserService } from './user.service';

@Injectable()
export class LenderFormService {

  formsCol: AngularFirestoreCollection<Form>;
  forms: Observable<Form[]>;

  constructor(private afs: AngularFirestore, private authService: AuthService,
    private router: Router, private us: UserService,
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
    const formsRef: AngularFirestoreDocument<any> = 
    this.afs.doc(`users/${this.authService.currentUserId}/forms/${id}`);
    formsRef.delete().then(() => console.log(`form ${id} deleted`));
  }

  addForm(i) {
    const formClass: FormClass = new FormClass();
    const formId = this.afs.createId();
    const formsRef: AngularFirestoreDocument<any> = 
    this.afs.collection(`users/${this.authService.currentUserId}/forms`).doc(formId);
    const form: Form = formClass.form;
    form.formId = formId;
    form.formName = `form${i}`;
    form.formNumber = i;
    form.updateTime = new Date().toString();
    form.startTime = new Date().toString();
    formsRef.set(form).then(() => console.log(`form ${formId} added`));
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
        userInfo.assignedForms[`${formId}`] = this.authService.currentUserId;
        this.us.updateUser(userInfo);
       }
       sub.unsubscribe();
      });
  }

  unAssignForm(formId, uid) {
    const user = this.afs.collection<UserInfo>('users', ref => ref.where('uid', '==', uid)).valueChanges();
    const sub = user.subscribe((data) => {
      const userInfo = data[0];
      if (userInfo) {
        delete userInfo.assignedForms[`${formId}`];
        this.us.updateUser(userInfo);
      }
      sub.unsubscribe();
     });
  }

  reAssignForm(formId, uid) {
    // This function reassigned the updated form to all purchased users regardless of category
    // uid it the logged in user (auth user) keeping it for now for the admin manage case and
    // may have to add the to the rest of the functions in this file
    const sub2 = this.afs.doc<UserInfo>(`users/${uid}`).valueChanges().subscribe((lender) => {
      const purchasedUsers = lender.purchased;
      purchasedUsers.forEach(borrowerId => {
        const sub1 = this.afs.doc<UserInfo>(`users/${borrowerId}`).valueChanges().subscribe((borrower) => {
          if (borrower.assignedForms[`${formId}`] === lender.uid) {
              const form = this.afs.doc<UserInfo>(`users/${lender.uid}`)
              .collection<Form>('forms', ref => ref.where('formId', '==', formId)).valueChanges();
              const sub0 = form.subscribe((data) => {
                let formData = data[0];
                console.log('lender uid = ', lender.uid)
                formData.formCreator = lender.uid;
                formData.updateTime = new Date().toString();
                formData.startTime = new Date().toString();
                this.afs.doc(`users/${borrower.uid}`).collection('forms').doc(new Date().toString()).set(formData);
                sub0.unsubscribe();
            });
          }
          sub1.unsubscribe();
        });
      });
      sub2.unsubscribe();
    });
  }

}
