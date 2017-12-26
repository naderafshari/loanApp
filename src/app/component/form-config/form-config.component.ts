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

@Component({
  selector: 'app-form-config',
  templateUrl: './form-config.component.html',
  styleUrls: ['./form-config.component.css']
})
export class FormConfigComponent implements OnInit {
  form: Form;
  id: string;
  fields: Field[] = [];
  sub: Subscription;

  constructor(private afs: AngularFirestore,
    public fs: FormService,
    private router: Router,
    private route: ActivatedRoute) {

    this.route.params.subscribe(params => {
      this.id = params['id'] || 0;
      if (this.id) {
        this.sub = this.fs.getForm(this.id).subscribe((data) => {
          this.form = data;
          this.fields = [];
          for (let i = 1; i <= 20; i++) {
            const obj: Form = this.form;
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
      }
    });
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

  updateForm() {
    if (this.form) {
      this.afs.collection('forms').doc(this.id).update(this.form);
    } else {
      alert('Cannot Update, user not logged in!');
    }
    this.sub.unsubscribe();
    this.router.navigateByUrl('/form-manage');
  }

  ngOnInit() {
  }

}
