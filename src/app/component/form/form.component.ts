import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { AuthService } from '../../provider/auth.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/forkJoin';
import { UserInfo } from '../../model/user-info';
import { Form } from '../../model/form';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {

  userDoc: any;
  forms: Observable<Form[]>;
  user: any;
  uid: string;
  formId: string;
  formData: Form;
  formRef: AngularFirestoreCollection<Form>;
  fields: {
    index: number;
    name: string;
    type: string;
    //option1: string;
    value: string;
  }[] = [];
  /*names : string[] = [];
  types : string[] = [];
  option1 : string[] = [];
  option2 : string[] = [];
  option3 : string[] = [];
  option4 : string[] = [];
  option5 : string[] = [];
  option6 : string[] = [];
  values : string[] = [];*/
  index = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20];
  
  constructor(private afs: AngularFirestore,
    public authService: AuthService,
    private router: Router,
    private route: ActivatedRoute) {

    this.route.params.subscribe(params => {
      this.uid = params['uid'] || 0;
      this.formId = params['fid'] || 0;
      // console.log('form id', this.formId);
      // console.log('user id', this.uid);
      if (this.uid) {
        this.formRef = this.afs.doc(`users/${this.uid}`).collection<Form>('forms', ref =>
          ref.where('formId', '==', this.formId).orderBy('startTime', 'desc').limit(1));
        this.forms = this.formRef.valueChanges();
      }
      this.forms.subscribe((data) => {
        this.formData = data[0];
        //if(this.formData.field1 !== undefined) {
          for (let i = 1; i <= 20; i++) {
            const obj: Form = this.formData;
            this.fields.push({
                                index: i,
                                name: eval('obj.field'+i+'.name'), 
                                type: eval('obj.field'+i+'.type'), 
                                value: eval('obj.field'+i+'.value')
                              });
            /*this.types.push(eval('obj.field'+i+'.type'));
            this.option1.push(eval('obj.field'+i+'.option1'));
            this.option2.push(eval('obj.field'+i+'.option2'));
            this.option3.push(eval('obj.field'+i+'.option3'));
            this.option4.push(eval('obj.field'+i+'.option4'));
            this.option5.push(eval('obj.field'+i+'.option5'));
            this.option6.push(eval('obj.field'+i+'.option6'));
            this.values.push('formData.field'+i+'.value');*/
          }
        //}
        console.log(this.fields);
       });
  });
  }
  getValue(i){
    return this.fields[i].value;
  }

  setValue(value,i) {
    console.log(value);
    console.log(i)
    //const obj: Form = this.formData;
    //eval('obj.field'+i+'.value = '+value);
    //this.formData = obj;
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
    this.router.navigateByUrl('/user-manage');
  }

  ngOnInit() {
  }

}
