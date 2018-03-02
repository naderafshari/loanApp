import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { AuthService } from '../../provider/auth.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/forkJoin';
import { Form, Field, USStatesClass, CountriesClass } from '../../model/form';
import { FormService } from '../../provider/form.service';
import { LenderFormService } from '../../provider/lender-form.service';
import { Subscription } from 'rxjs/Subscription';
import { firestore } from 'firebase';
import { UserInfo } from './../../model/user-info';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DialogComponent } from '../dialog/dialog.component';

@Component({
  selector: 'app-form-config',
  templateUrl: './form-config.component.html',
  styleUrls: ['./form-config.component.css']
})
export class FormConfigComponent implements OnInit {
  form: Form;
  userId: string;
  id: string;
  fields: any[];
  sub: Subscription;
  usedFields: any[];
  options: any;
  choices: any;
  usedOptions: any[];
  usedChoices: any[];
  maxUsedField: any;
  minUsedField: any;
  mask: string;

  constructor(private afs: AngularFirestore, public fs: FormService, private location: Location,
              private router: Router, private route: ActivatedRoute,public lfs: LenderFormService,
              private authService: AuthService, public dialog: MatDialog) {
    this.userId = this.authService.currentUserId;
    this.route.params.subscribe(params => {
      this.id = params['id'] || 0;
      if (this.id) {
        this.sub = this.fs.getForm(this.id).subscribe((data) => {
          this.form = data;
          if (this.form) {
            this.updateFields();
          }
        });
      }
    });
  }

  updateFields() {
    const usedFields = Object.keys(this.form)
    .filter( fields => fields.charAt(0) === 'f')
    .filter( fields => fields.charAt(1) === 'i')
    .filter( fields => fields.charAt(2) === 'e');
    this.usedFields = usedFields.map((x) => x.charAt(5) + x.charAt(6));
    if (this.usedFields.length) {
      this.usedFields.sort((a, b) => {
       return (Number(a) > Number(b) ? 1 : (Number(b) > Number(a) ? -1 : 0));
      });
      this.maxUsedField = this.usedFields.reduce((a, b) => {
        return Math.max(Number(a), Number(b));
      });
      this.minUsedField = this.usedFields.reduce((a, b) => {
        return Math.min(Number(a), Number(b));
      });
      this.fields = [];
      this.usedOptions = [];
      this.usedChoices = [];
      for (let i = 0; i < this.form.numOfFields; i++) {
        const obj: Form = this.form;
        const field: Field = eval('obj.field' + this.usedFields[i]);
        const obj1 = field.options;
        const optionType = eval('obj1.type');
        const usedOptions = Object.keys(field.options)
        .filter( fields => fields.charAt(0) === 'o');
        this.usedOptions = usedOptions.map((x) => x.charAt(6) + x.charAt(7) + x.charAt(8));
        this.usedOptions.sort((a, b) => {
          return (Number(a) > Number(b) ? 1 : (Number(b) > Number(a) ? -1 : 0));
        });
        this.options = {};
        this.options['type'] = optionType;
        for (let j = 0; j < field.numOfOptions; j++) {
          const obj2: Field = field;
          const option = eval('obj2.options.option' + this.usedOptions[j]);
          const key = `option${this.usedOptions[j]}`;
          this.options[key] = option;
        }
        /** To force the html to only show one option as the non custom label */
        if ( optionType !== 'custom') {
          this.usedOptions.length = 0;
          this.usedOptions[0] = '1';
        }

        const usedChoices = Object.keys(field.choices)
        .filter( fields => fields.charAt(0) === 'c');
        this.usedChoices = usedChoices.map((x) => x.charAt(6) + x.charAt(7));
        this.usedChoices.sort((a, b) => {
          return (Number(a) > Number(b) ? 1 : (Number(b) > Number(a) ? -1 : 0));
        });
        this.choices = {};
        for (let j = 0; j < field.numOfChoices; j++) {
          const obj2: Field = field;
          const choice = eval('obj2.choices.choice' + this.usedChoices[j]);
          const key = `choice${this.usedChoices[j]}`;
          this.choices[key] = choice;
        }

        const obj3: Form = this.form;
        this.fields.push({
          it:             i,
          index:          this.usedFields[i],
          name:           eval('obj3.field' + this.usedFields[i] + '.name'),
          required:       eval('obj3.field' + this.usedFields[i] + '.required'),
          restricted:     eval('obj3.field' + this.usedFields[i] + '.restricted'),
          type:           eval('obj3.field' + this.usedFields[i] + '.type'),
          mask:           eval('obj3.field' + this.usedFields[i] + '.mask'),
          numOfOptions:   eval('obj3.field' + this.usedFields[i] + '.numOfOptions'),
          numOfChoices:   eval('obj3.field' + this.usedFields[i] + '.numOfChoices'),
          value:          eval('obj3.field' + this.usedFields[i] + '.value'),
          toolTip:        eval('obj3.field' + this.usedFields[i] + '.toolTip'),
          options:        this.options,
          choices:        this.choices,
          usedOptions:    this.usedOptions,
          usedChoices:    this.usedChoices
        });
      }
    } else {
      this.usedOptions = [];
      this.options = {};
      this.choices = {};
      this.fields = [];
    }
  }

  addStatesOption(index, it) {
    const usStatesCLass: USStatesClass = new USStatesClass();
    const usStates = usStatesCLass.usStates;
    this.form[`field${index}`].options = usStates;
    this.form[`field${index}`].numOfOptions = 59;
    this.updateFields();
  }

  addCountriesOption(index, it) {
    const countriesCLass: CountriesClass = new CountriesClass();
    const countries = countriesCLass.countries;
    this.form[`field${index}`].options = countries;
    this.form[`field${index}`].numOfOptions = 198;
    this.updateFields();
  }

  addOption(index, it) {
    const nextOptionId = `option${this.nextOptionSlot(0, 'up', it)}`;
    this.form[`field${index}`].options[nextOptionId] = '';
    this.form[`field${index}`].options['type'] = 'custom';
    this.form[`field${index}`].numOfOptions++;
    this.updateFields();
  }

  deleteOption(index, i) {
    if (this.form[`field${index}`].options.type === 'custom') {
      delete this.form[`field${index}`].options[`option${i}`];
      this.form[`field${index}`].numOfOptions--;
    } else {
      this.form[`field${index}`].options = {};
      this.form[`field${index}`].numOfOptions = 0;
      this.form[`field${index}`].options['type'] = 'custom';
    }
    this.updateFields();
  }

  addChoice(index, it) {
    const nextChoiceId = `choice${this.nextChoiceSlot(0, 'up', it)}`;
    this.form[`field${index}`].choices[nextChoiceId] = '';
    this.form[`field${index}`].numOfChoices++;
    this.updateFields();
  }

  deleteChoice(index, i) {
    delete this.form[`field${index}`].choices[`choice${i}`];
    this.form[`field${index}`].numOfChoices--;
    this.updateFields();
  }

  addField() {
    const nextFieldId = `field${this.nextAvailSlot(0, 'up')}`;
    const fieldToAdd: Field  = {
      name: '',
      required: false,
      restricted: true,
      type: '',
      mask: 'None',
      numOfOptions: 0,
      options: {type: 'custom'},
      numOfChoices: 0,
      choices: {},
      toolTip: '',
      value: ''
    };
    this.form[nextFieldId] = fieldToAdd;
    this.form.numOfFields++;
    this.updateFields();
  }

  deleteField(index) {
    const fieldToDelete = `field${index}`;
    if (this.form) {
      this.form.numOfFields--;
      delete this.form[fieldToDelete];
      this.updateFields();
      // this.afs.collection('forms').doc(this.id).set(this.form);
      /*const docRef = this.afs.collection('forms').doc(this.id);
      delete this.form[fieldToDelete];
      this.form.numOfFields--;
      this.updateFields();
      docRef.update({[fieldToDelete]: firestore.FieldValue.delete()})
      .then(() => {console.log('delete success');
        this.form.updateTime = new Date().toString();
        this.updateForm();
      })
      .catch((err) => console.log(err));*/
    } else {
      alert('Cannot Update, user not logged in!');
    }
  }

  deleteAllFields() {
    for (let i = 0; i < this.form.numOfFields; i++) {
      delete this.form[`field${this.usedFields[i]}`];
    }
    this.form.numOfFields = 0;
    this.updateFields();
    // this.afs.collection('forms').doc(this.id).set(this.form);
  }

  allRequireFields() {
    if (this.form.formName === '') {
      return false;
    }
    // for (let i = 0; i < this.form.numOfFields; i++) {
      // const obj: Form = this.form;
      // if (eval('obj.field' + this.usedFields[i] + '.name == "" ') || this.form.formName === '') {
    // }
    return true;
  }

  updateForm() {
    if (this.form) {
      if (this.allRequireFields()) {
        this.form.updateTime = new Date().toString();
        this.afs.collection('forms').doc(this.id).set(this.form).then(() => this.updateFields());
        this.sub.unsubscribe();
        this.goBack();
      } else {
        alert('Required field was not filled!');
      }
    } else {
      alert('Cannot Update, form not available!');
      this.sub.unsubscribe();
      this.goBack();
    }
  }

  updateFormAndReAssign() {
    if (this.form) {
      if (this.allRequireFields()) {
        this.form.updateTime = new Date().toString();
        this.afs.collection('forms').doc(this.id).set(this.form).then(() => this.updateFields());
        if (this.authService.userFunction === 'lender') {
          this.lfs.reAssignForm(this.form.formId, this.userId);
        } else if (this.authService.userAuthRole === 'admin' ) {
          this.fs.reAssignFormAllUsers(this.form.formId, this.userId );
        } else {
          alert('Form cannot be reassigned!');
        }
        this.sub.unsubscribe();
        this.goBack();
      } else {
        alert('Required field was not filled!');
      }
    } else {
      alert('Cannot Update, form not available!');
      this.sub.unsubscribe();
      this.goBack();
    }
  }

  openDeleteAllDialog(): void {
    if (this.authService.userAuthRole === 'admin') {
      const dialogRef = this.dialog.open(DialogComponent, {
        width: '250px',
        data: 'You are about to Delete All Fields. Fields and their content will be removed. Are you sure?'
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result === 'Confirm') {
          this.deleteAllFields();
        }
      });
    } else {
      alert('No Delete privilages! Please contact the Administrator');
    }
  }

  openDeleteDialog(index): void {
    if (this.authService.userAuthRole === 'admin') {
      const dialogRef = this.dialog.open(DialogComponent, {
        width: '250px',
        data: 'You are about to Delete a Field. Field and content will be removed. Are you sure?'
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result === 'Confirm') {
          this.deleteField(index);
        }
      });
    } else {
      alert('No Delete privilages! Please contact the Administrator');
    }
  }

  openSubmitReassignDialog(index): void {
    if (this.authService.userAuthRole === 'admin' ||
        this.authService.userAuthRole === 'super' ||
        this.authService.userFunction === 'lender' ) {
      const dialogRef = this.dialog.open(DialogComponent, {
        width: '250px',
        data: 'You are about to submit changer.\n\nA fresh copy of the updated Form will be "Reassigned" to all user whom are assigned this Form.\n\nAre you sure?'
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result === 'Confirm') {
          this.updateFormAndReAssign();
        }
      });
    } else {
      alert('No Submit privilages! Please contact the Administrator');
    }
  }

  openSubmitDialog(index): void {
    if (this.authService.userAuthRole === 'admin' ||
        this.authService.userAuthRole === 'super' ||
        this.authService.userFunction === 'lender' ) {
      const dialogRef = this.dialog.open(DialogComponent, {
        width: '250px',
        data: 'You are about to submit changer.\n\nFor changes to take effect the Form has to be "Reassigned".\n\nAre you sure?'
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result === 'Confirm') {
          this.updateForm();
        }
      });
    } else {
      alert('No Submit privilages! Please contact the Administrator');
    }
  }

  nextOptionSlot(current, direction, it) {
    let inc = 1;
    if ( direction === 'down' ) {
        inc = -1;
    }
    const next = current + inc;
    for (let j = 0; j < this.fields[it].usedOptions.length; j++) {
      if ( Number(this.fields[it].usedOptions[j]) === next ) {
        return this.nextOptionSlot(next , direction, it );
      }
    }
    return next ;
  }

  nextChoiceSlot(current, direction, it) {
    let inc = 1;
    if ( direction === 'down' ) {
        inc = -1;
    }
    const next = current + inc;
    for (let j = 0; j < this.fields[it].usedChoices.length; j++) {
      if ( Number(this.fields[it].usedChoices[j]) === next ) {
        return this.nextChoiceSlot(next , direction, it );
      }
    }
    return next ;
  }

  nextAvailSlot(current, direction) {
    let inc = 1;
    if ( direction === 'down' ) {
        inc = -1;
    }
    const next = current + inc;
    for (let i = 0; i < this.usedFields.length; i++) {
      if ( Number(this.usedFields[i]) === next ) {
        return this.nextAvailSlot(next , direction );
      }
    }
    return next ;
  }

  nextUsedSlot(current, direction) {
    let inc = 1;
    if ( direction === 'down' ) {
        inc = -1;
    }
    const next = current + inc;
    if (next > this.maxUsedField || next < this.minUsedField) {
      return 'ERROR';
    } else {
      for (let i = 0; i < this.usedFields.length; i++) {
        if ( Number(this.usedFields[i]) === next ) {
          return next;
        }
      }
      return this.nextUsedSlot(next , direction );
    }
  }

  moveUp(index) {
    const nextField = this.nextUsedSlot(Number(index), 'down');
    if (nextField !== 'ERROR') {
      const tmp = this.form[`field${nextField}`];
      this.form[`field${nextField}`] = this.form[`field${index}`];
      this.form[`field${index}`] = tmp;
      this.updateFields();
    }
  }

  moveDown(index) {
    const nextField = this.nextUsedSlot(Number(index), 'up');
    if (nextField !== 'ERROR') {
      const tmp = this.form[`field${nextField}`];
      this.form[`field${nextField}`] = this.form[`field${index}`];
      this.form[`field${index}`] = tmp;
      this.updateFields();
    }
  }

  getName(i) {
    const obj: Form = this.form;
    return eval('obj.field' + i + '.name');
  }

  setName(name, i) {
    let obj: Form = this.form;
    eval('obj.field' + i + '.name = name');
    this.form = obj;
  }

  getToolTip(i) {
    const obj: Form = this.form;
    return eval('obj.field' + i + '.toolTip');
  }

  setToolTip(toolTip, i) {
    let obj: Form = this.form;
    eval('obj.field' + i + '.toolTip = toolTip');
    this.form = obj;
  }

  getRequired(i) {
    const obj: Form = this.form;
    return eval('obj.field' + i + '.required');
  }

  setRequired(required, i) {
    let obj: Form = this.form;
    eval('obj.field' + i + '.required = required');
    this.form = obj;
  }

  getRestricted(i) {
    const obj: Form = this.form;
    return eval('obj.field' + i + '.restricted');
  }

  setRestricted(restricted, i) {
    let obj: Form = this.form;
    eval('obj.field' + i + '.restricted = restricted');
    this.form = obj;
  }

  getType(i) {
    const obj: Form = this.form;
    return eval('obj.field' + i + '.type');
  }

  setType(type, i) {
    let obj: Form = this.form;
    eval('obj.field' + i + '.type = type');
    this.form = obj;
  }

  getMask(i) {
    const obj: Form = this.form;
    return eval('obj.field' + i + '.mask');
  }

  setMask(mask, i) {
    let obj: Form = this.form;
    eval('obj.field' + i + '.mask = mask');
    this.form = obj;
  }

  getOption(i, j) {
    const obj: Form = this.form;
    if (eval('obj.field' + i + '.options.type') === 'USStates') {
      return 'US States';
    } else if (eval('obj.field' + i + '.options.type') === 'Countries') {
      return 'Countries';
    }
    return eval('obj.field' + i + '.options.option' + j);
  }

  setOption(option, i, j) {
    let obj: Form = this.form;
    eval('obj.field' + i + '.options.option' + j + ' = option');
    this.form = obj;
  }

  getChoice(i, j) {
    const obj: Form = this.form;
    return eval('obj.field' + i + '.choices.choice' + j);
  }

  setChoice(choice, i, j) {
    let obj: Form = this.form;
    eval('obj.field' + i + '.choices.choice' + j + ' = choice');
    this.form = obj;
  }

  goBack() {
    this.location.back();
  }

  ngOnInit() {
  }

}
