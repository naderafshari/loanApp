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
import emailMask from 'text-mask-addons/dist/emailMask';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';
import createAutoCorrectedDatePipe from 'text-mask-addons/dist/createAutoCorrectedDatePipe';

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
  form: Form;
  formRef: AngularFirestoreCollection<Form>;
  fields: any[];
  usedFields: any[];
  usedOptions: any[];
  optionsValues: any[];

  constructor(private afs: AngularFirestore,
    public authService: AuthService,
    private router: Router,
    private route: ActivatedRoute) {

      const numberMask = createNumberMask({
        prefix: '$',
        suffix: '',
        allowDecimal: 'true'
      })
      const maskCodes = {
      'None':           "",
      'USPhoneNumber':  ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/],  // Phone Number
      'USDate':         [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/],  // Date
      'USDollar':       numberMask, // US DOllar with decimal
      'USZipCode':      [/\d/, /\d/, /\d/, /\d/, /\d/],   // Zip code
      'Email':          emailMask // email
    };

    this.route.params.subscribe(params => {
      this.uid = params['uid'] || 0;
      this.formId = params['fid'] || 0;
      if (this.uid) {
        this.formRef = this.afs.doc(`users/${this.uid}`).collection<Form>('forms', ref =>
          ref.where('formId', '==', this.formId));
        this.forms = this.formRef.valueChanges();
      }
      this.sub = this.forms.subscribe((data) => {
        data.sort((a, b) => {
          const dateA: number = new Date(a.updateTime).valueOf();
          const dateB: number = new Date(b.updateTime).valueOf();
          return dateB - dateA;
        });
        this.form = data[0];
        const usedFields = Object.keys(this.form)
        .filter( fields => fields.charAt(0) === 'f')
        .filter( fields => fields.charAt(1) === 'i')
        .filter( fields => fields.charAt(2) === 'e');
        this.usedFields = usedFields.map((x) => x.charAt(5) + x.charAt(6));
        if (this.usedFields.length) {
          this.fields = [];
          this.usedOptions = [];
          for (let i = 0; i < this.form.numOfFields; i++) {
            const obj: Form = this.form;
            const field: Field = eval('obj.field' + this.usedFields[i]);
            const usedOptions = Object.keys(field.options)
            .filter( fields => fields.charAt(0) === 'o');
            this.usedOptions = usedOptions.map((x) => x.charAt(6) + x.charAt(7));
            this.optionsValues = [];
            for (let j = 0; j < field.numOfOptions; j++) {
              const obj2: Field = field;
              const option = eval('obj2.options.option' + this.usedOptions[j]);
              this.optionsValues.push(option);
            }
            const obj3: Form = this.form;
            this.fields.push({
              index:          this.usedFields[i],
              name:           eval('obj3.field' + this.usedFields[i] + '.name'),
              required:       eval('obj3.field' + this.usedFields[i] + '.required'),
              type:           eval('obj3.field' + this.usedFields[i] + '.type'),
              mask:           maskCodes[eval('obj3.field' + this.usedFields[i] + '.mask')],
              numOfOptions:   eval('obj3.field' + this.usedFields[i] + '.numOfOptions'),
              value:          eval('obj3.field' + this.usedFields[i] + '.value'),
              optionsValues:   this.optionsValues
            });
          }
        }
      });
    });
  }

  getValue(i) {
    const obj: Form = this.form;
    return eval('obj.field' + i + '.value');
  }

  setValue(value, i) {
    let obj: Form = this.form;
    eval('obj.field' + i + '.value = value');
    this.form = obj;
  }

  updateForm() {
    if (this.allRequireFields()) {
      if (this.form ) {
        this.form.updateTime = new Date().toString();
        /* Use this if want to create a new record at every submit */
        this.afs.doc(`users/${this.uid}`).collection('forms').doc(this.form.updateTime).set(this.form);
        /* Or update and existing form... */
        // this.afs.doc(`users/${this.uid}`).collection('forms').doc(this.form.startTime).update(this.form);
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
    for (let i = 0; i < this.form.numOfFields; i++) {
      const obj: Form = this.form;
      if (eval('obj.field' + this.usedFields[i] + '.required == true && obj.field' + this.usedFields[i] + '.value == ""') ) {
        return false;
      }
    }
    return true;
  }

  saveFile() {
    const fields = [];
    for (let i = 0; i < this.form.numOfFields; i++) {
      const obj: Form = this.form;
      const name = eval('obj.field' + this.usedFields[i] + '.name');
      const value = eval('obj.field' + this.usedFields[i] + '.value');
      fields.push(
        name, value
      );
      // fields.push({
      //  [name], value
      // });
    }
    const filename = `${this.form.formName}` + `${this.form.updateTime}`;
    const blob = new Blob([JSON.stringify(fields)], { type: 'text/plain' });
    saveAs(blob, filename);
  }

  ngOnInit() {
  }

}
