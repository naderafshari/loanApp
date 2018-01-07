import { Injectable } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { Form, FormClass } from '../model/form';
import { FormConfigComponent } from '../component/form-config/form-config.component';

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

}
