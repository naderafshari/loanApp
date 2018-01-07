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
  selector: 'app-form-review',
  templateUrl: './form-review.component.html',
  styleUrls: ['./form-review.component.css']
})
export class FormReviewComponent implements OnInit {
  forms: Observable<Form[]>;
  sub: Subscription;
  uid: string;
  tid: string;
  formData: Form;
  formRef: AngularFirestoreCollection<Form>;
  fields: any[];

  constructor(private afs: AngularFirestore,
    public authService: AuthService,
    private router: Router,
    private route: ActivatedRoute) {

    this.route.params.subscribe(params => {
      this.uid = params['uid'] || 0;
      this.tid = params['tid'] || 0;
      if (this.tid && this.uid) {
        this.formRef = this.afs.doc(`users/${this.uid}`).collection<Form>('forms', ref =>
          ref.where('updateTime', '==', this.tid));
        this.forms = this.formRef.valueChanges();
        this.sub = this.forms.subscribe((data) => {
          if (data) {
            this.formData = data[0];
            this.fields = [];
            for (let i = 1; i <= this.formData.numOfFields; i++) {
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
            // console.log(this.fields);
          }
        });
      }
    });
  }

  goBack() {
    this.router.navigate(['/form-history', this.uid]);
  }
  ngOnInit() {
  }

}





