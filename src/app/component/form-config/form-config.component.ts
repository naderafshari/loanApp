import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { AuthService } from '../../provider/auth.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/forkJoin';
import { Form, Field } from '../../model/form';
import { FormService } from '../../provider/form.service';
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
  usedOptions: any[];
  maxUsedField: any;
  minUsedField: any;
  mask: string;

  constructor(private afs: AngularFirestore, public fs: FormService,
              private router: Router, private route: ActivatedRoute,
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
      for (let i = 0; i < this.form.numOfFields; i++) {
        const obj: Form = this.form;
        const field: Field = eval('obj.field' + this.usedFields[i]);
        const usedOptions = Object.keys(field.options);
        this.usedOptions = usedOptions.map((x) => x.charAt(6) + x.charAt(7));
        this.usedOptions.sort((a, b) => {
          return (Number(a) > Number(b) ? 1 : (Number(b) > Number(a) ? -1 : 0));
        });
        this.options = {};
        for (let j = 0; j < field.numOfOptions; j++) {
          const obj2: Field = field;
          const option = eval('obj2.option' + this.usedOptions[j]);
          const key = `option${this.usedOptions[j]}`;
          this.options[key] = option;
        }
        const obj3: Form = this.form;
        this.fields.push({
          it:             i,
          index:          this.usedFields[i],
          name:           eval('obj3.field' + this.usedFields[i] + '.name'),
          required:       eval('obj3.field' + this.usedFields[i] + '.required'),
          type:           eval('obj3.field' + this.usedFields[i] + '.type'),
          mask:           eval('obj3.field' + this.usedFields[i] + '.mask'),
          numOfOptions:   eval('obj3.field' + this.usedFields[i] + '.numOfOptions'),
          options:        this.options,
          value:          eval('obj3.field' + this.usedFields[i] + '.value'),
          usedOptions:    this.usedOptions
        });
      }
    } else {
      this.usedOptions = [];
      this.options = {};
      this.fields = [];
    }
  }

  addOption(index, it) {
    const nextOptionId = `option${this.nextOptionSlot(0, 'up', it)}`;
    this.form[`field${index}`].options[nextOptionId] = '';
    this.form[`field${index}`].numOfOptions++;
    this.updateFields();
  }

  deleteOption(index, i) {
    delete this.form[`field${index}`].options[`option${i}`];
    this.form[`field${index}`].numOfOptions--;
    this.updateFields();
  }

  addField() {
    const nextFieldId = `field${this.nextAvailSlot(0, 'up')}`;
    const fieldToAdd: Field  = {
      name: '',
      required: false,
      type: '',
      mask: 'None',
      numOfOptions: 0,
      options: {},
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
      this.form.updateTime = new Date().toString();
      this.afs.collection('forms').doc(this.id).set(this.form).then(() => this.updateFields());
    } else {
      alert('Cannot Update, form not available!');
    }
  }

  updateFormAndRoute() {
    if (this.form) {
      if (this.allRequireFields()) {
        this.form.updateTime = new Date().toString();
        this.afs.collection('forms').doc(this.id).set(this.form).then(() => this.updateFields());
        this.sub.unsubscribe();
        this.router.navigate(['/form-manage', this.userId]);
      } else {
        alert('Required field was not filled!');
      }
    } else {
      alert('Cannot Update, form not available!');
      this.sub.unsubscribe();
      this.router.navigate(['/form-manage', this.userId]);
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

  openSubmitDialog(index): void {
    if (this.authService.userAuthRole === 'admin' || this.authService.userAuthRole === 'super') {
      const dialogRef = this.dialog.open(DialogComponent, {
        width: '250px',
        data: 'You are about to submit changer.\n\nFor changes to take effect the Form has to be "Reassigned".\n\nAre you sure?'
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result === 'Confirm') {
          this.updateFormAndRoute();
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

  getRequired(i) {
    const obj: Form = this.form;
    return eval('obj.field' + i + '.required');
  }

  setRequired(required, i) {
    let obj: Form = this.form;
    eval('obj.field' + i + '.required = required');
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
    return eval('obj.field' + i + '.options.option' + j);
  }

  setOption(option, i, j) {
    let obj: Form = this.form;
    eval('obj.field' + i + '.options.option' + j + ' = option');
    this.form = obj;
  }

  goBack() {
    this.router.navigate(['/form-manage', this.userId]);
  }

  ngOnInit() {
  }

}
