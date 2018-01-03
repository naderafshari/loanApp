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
  form2: Form;
  userId: string;
  id: string;
  fields: any[] = [];
  sub: Subscription;
  usedFields: any[] = [];

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
// console.log(this.usedFields);
    this.fields = [];
    for (let i = 0; i < this.form.numOfFields; i++) {
      const obj: Form = this.form;
      this.fields.push({
        index:    this.usedFields[i],
        name:     eval('obj.field' + this.usedFields[i] + '.name'),
        required: eval('obj.field' + this.usedFields[i] + '.required'),
        type:     eval('obj.field' + this.usedFields[i] + '.type'),
        option1:  eval('obj.field' + this.usedFields[i] + '.option1'),
        option2:  eval('obj.field' + this.usedFields[i] + '.option2'),
        option3:  eval('obj.field' + this.usedFields[i] + '.option3'),
        option4:  eval('obj.field' + this.usedFields[i] + '.option4'),
        option5:  eval('obj.field' + this.usedFields[i] + '.option5'),
        option6:  eval('obj.field' + this.usedFields[i] + '.option6'),
        value:    eval('obj.field' + this.usedFields[i] + '.value')
      });
    }
  }

  addField() {
    const fieldToAdd: Field  = {
      name: '',
      required: false,
      type: '',
      option1: '----None----',
      option2: '',
      option3: '',
      option4: '',
      option5: '',
      option6: '',
      value: ''
    };
    const nextFieldId = `field${this.nextSlot(0, 'up')}`;
    this.form[nextFieldId] = fieldToAdd;
    this.form.numOfFields++;
    this.form.updateTime = new Date().toString();
    this.updateForm();
  }

  deleteField(index) {
    const fieldToDelete = `field${index}`;
    if (this.form) {
      this.form.numOfFields--;
      this.form.updateTime = new Date().toString();
      delete this.form[fieldToDelete];
      this.updateFields();
      this.afs.collection('forms').doc(this.id).set(this.form);
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
    this.form.updateTime = new Date().toString();
    this.form.numOfFields = 0;
    this.updateFields();
    this.afs.collection('forms').doc(this.id).set(this.form);
  }

  updateForm() {
    if (this.form) {
      this.afs.collection('forms').doc(this.id).update(this.form).then(() => this.updateFields());
    } else {
      alert('Cannot Update, user not logged in!');
    }
  }

  updateFormAndRoute() {
    if (this.form) {
      this.afs.collection('forms').doc(this.id).update(this.form).then(() => this.updateFields());
    } else {
      alert('Cannot Update, user not logged in!');
    }
    this.sub.unsubscribe();
    this.router.navigate(['/form-manage', this.userId]);
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

  nextSlot(current, direction) {
    let inc = 1;
    if ( direction === 'down' ) {
        inc = -1;
    }
    const next = current + inc;
    for (let i = 0; i < this.usedFields.length; i++) {
      if ( Number(this.usedFields[i]) === next ) {
        return this.nextSlot(next , direction );
      }
    }
    return next ;
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

  getOption(i, j) {
    const obj: Form = this.form;
    return eval('obj.field' + i + '.option' + j);
  }

  setOption(option, i, j) {
    let obj: Form = this.form;
    eval('obj.field' + i + '.option' + j + ' = option');
    this.form = obj;
  }

  goBack() {
    this.router.navigate(['/form-manage', this.userId]);
  }

  ngOnInit() {
  }

}
