import { Injectable } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { Form } from '../model/form';
import { FormConfigComponent } from '../component/form-config/form-config.component'

@Injectable()
export class FormService {

  formsCol: AngularFirestoreCollection<Form>;
  userDoc: AngularFirestoreDocument<Form>;
  forms: Observable<Form[]>;

  constructor(private afs: AngularFirestore,
    private router: Router,
    private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.createForms();
    this.formsCol = this.afs.collection<Form>('forms');
    this.forms = this.formsCol.valueChanges();
    /*this.forms = this.formsCol.snapshotChanges().map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data() as Form;
        const id = a.payload.doc.id;
        return data;
      });
    });*/
  }

  createForms(){
    for (let i = 1; i<= 10; i++) {
      const formsRef: AngularFirestoreDocument<any> = this.afs.doc(`forms/form${i}`);
      const Form: Form = {formName: `Form${i}`};
      formsRef.set(Form);
    }
  }

}
