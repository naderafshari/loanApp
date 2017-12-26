import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { AuthService } from '../../provider/auth.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/forkJoin';
import { UserInfo } from '../../model/user-info';
import { Form, Field } from '../../model/form';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {

  userDoc: any;
  forms: Observable<Form[]>;
  sub: Subscription;
  user: any;
  uid: string;
  formId: string;
  formData: Form;
  formRef: AngularFirestoreCollection<Form>;
  fields: Field[] = [];

  constructor(private afs: AngularFirestore,
    public authService: AuthService,
    private router: Router,
    private route: ActivatedRoute) {

    this.route.params.subscribe(params => {
      this.uid = params['uid'] || 0;
      this.formId = params['fid'] || 0;
      if (this.uid) {
        this.formRef = this.afs.doc(`users/${this.uid}`).collection<Form>('forms', ref =>
          ref.where('formId', '==', this.formId).orderBy('startTime', 'desc').limit(1));
        this.forms = this.formRef.valueChanges();
      }
      this.sub = this.forms.subscribe((data) => {
        this.formData = data[0];
        this.fields = [];
        for (let i = 1; i <= 20; i++) {
          const obj: Form = this.formData;
          this.fields.push({
            index:    i,
            name:     eval('obj.field' + i + '.name'),
            type:     eval('obj.field' + i + '.type'),
            option1:  eval('obj.field' + i + '.option1'),
            option2:  eval('obj.field' + i + '.option2'),
            option3:  eval('obj.field' + i + '.option3'),
            option4:  eval('obj.field' + i + '.option4'),
            option5:  eval('obj.field' + i + '.option5'),
            option6:  eval('obj.field' + i + '.option6'),
            value:    eval('obj.field' + i + '.value')
          });
        }
      });
  });
  }

  getValue(i) {
    const obj: Form = this.formData;
    return eval('obj.field' + i + '.value');
  }

  setValue(value, i) {
    let obj: Form = this.formData;
    eval('obj.field' + i + '.value = value');
    this.formData = obj;
  }

  updateFormData() {
    if (this.formData != null ) {
      this.formData.updateTime = new Date().toString();
      /* Use somthing like this is you want to create a new record at every submit */
       this.afs.doc(`users/${this.uid}`).collection('forms').doc(this.formData.updateTime).set(this.formData);
       /* Or update and existing form... */
      // this.afs.doc(`users/${this.uid}`).collection('forms').doc(this.formData.startTime).update(this.formData);
    } else {
      alert('Cannot Update, Form not available!');
    }
    this.sub.unsubscribe();
    this.router.navigateByUrl('/user-manage');
  }

  ngOnInit() {
  }

}
