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
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { saveAs } from 'file-saver/FileSaver';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {

  userDoc: any;
  forms: Observable<Form[]>;
  sub: Subscription;
  uid: string;
  formId: string;
  formData: Form;
  formRef: AngularFirestoreCollection<Form>;
  fields: any[] = [];
  usedFields: any[];
  options: any;
  usedOptions: any[];

  constructor(private afs: AngularFirestore,
    public authService: AuthService,
    private router: Router,
    private route: ActivatedRoute) {

    this.route.params.subscribe(params => {
      this.uid = params['uid'] || 0;
      this.formId = params['fid'] || 0;
      if (this.uid) {
        this.formRef = this.afs.doc(`users/${this.uid}`).collection<Form>('forms', ref =>
          ref.where('formId', '==', this.formId));//  .orderBy('startTime', 'desc').limit(1));
        this.forms = this.formRef.valueChanges();
      }
      this.sub = this.forms.subscribe((data) => {
        console.log(data);
        //this.formData = data[0];
        this.formData = data.find(form => {
          form.startTime === new Date(Math.max.apply(null, data.map(function(e) 
          {
            return new Date(e.startTime);
          }))).toString();
        });
        
        const usedFields = Object.keys(this.formData)
        .filter( fields => fields.charAt(0) === 'f')
        .filter( fields => fields.charAt(1) === 'i')
        .filter( fields => fields.charAt(2) === 'e');
        this.usedFields = usedFields.map((x) => x.charAt(5) + x.charAt(6));
        this.fields = [];
        this.usedOptions = [];
        for (let i = 0; i < this.formData.numOfFields; i++) {
          const obj: Form = this.formData;
          const field: Field = eval('obj.field' + this.usedFields[i]);
console.log(field);
          const usedOptions = Object.keys(field.options);
          this.usedOptions = usedOptions.map((x) => x.charAt(6) + x.charAt(7));
          this.options = {};
          for (let j = 0; j < field.numOfOptions; j++) {
            const obj2: Field = field;
            const option = eval('obj2.option' + this.usedOptions[j]);
            const key = `option${this.usedOptions[j]}`;
            this.options[key] = option;
          }
          const obj3: Form = this.formData;
          this.fields.push({
            it:             i,
            index:          this.usedFields[i],
            name:           eval('obj3.field' + this.usedFields[i] + '.name'),
            required:       eval('obj3.field' + this.usedFields[i] + '.required'),
            type:           eval('obj3.field' + this.usedFields[i] + '.type'),
            numOfOptions:   eval('obj3.field' + this.usedFields[i] + '.numOfOptions'),
            options:        this.options,
            value:          eval('obj3.field' + this.usedFields[i] + '.value'),
            usedOptions:    this.usedOptions
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
    if (this.allRequireFields()) {
      if (this.formData ) {
        this.formData.updateTime = new Date().toString();
        /* Use this if want to create a new record at every submit */
        this.afs.doc(`users/${this.uid}`).collection('forms').doc(this.formData.updateTime).set(this.formData);
        /* Or update and existing form... */
        // this.afs.doc(`users/${this.uid}`).collection('forms').doc(this.formData.startTime).update(this.formData);
      } else {
        alert('Cannot Update, Form not available!');
      }
      this.sub.unsubscribe();
      this.router.navigateByUrl('/user-manage');
    } else {
      alert('Required field was not filled!');
    }
  }

  allRequireFields() {
    for (let i = 0; i < this.formData.numOfFields; i++) {
      const obj: Form = this.formData;
      if (eval('obj.field' + this.usedFields[i] + '.required == true && obj.field' + this.usedFields[i] + '.value == ""') ) {
        return false;
      }
    }
    return true;
  }

  saveFile() {
    const fields = [];
    for (let i = 0; i < this.formData.numOfFields; i++) {
      const obj: Form = this.formData;
      const name = eval('obj.field' + this.usedFields[i] + '.name');
      const value = eval('obj.field' + this.usedFields[i] + '.value');
      fields.push(
        name, value
      );
      // fields.push({
      //  [name], value
      // });
    }
    const filename = `${this.formData.formName}` + `${this.formData.updateTime}`;
    const blob = new Blob([JSON.stringify(fields)], { type: 'text/plain' });
    saveAs(blob, filename);
  }
 
  ngOnInit() {
  }

}
