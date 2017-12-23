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
  selector: 'app-form1',
  templateUrl: './form1.component.html',
  styleUrls: ['./form1.component.css']
})
export class Form1Component implements OnInit {

  userDoc: any;
  forms: Observable<Form[]>;
  user: any;
  uid: string;
  formId: string;
  formData: Form;
  formRef: AngularFirestoreCollection<Form>;

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
          console.log(this.formData); });
    });
  }

  updateFormData() {
    if (this.formData != null ) {
      this.formData.updateTime = new Date().toString();
      /* Use somthing like this is you want to create a new record at every submit */
       this.afs.doc(`users/${this.uid}`).collection('forms').doc(this.formData.updateTime).set(this.formData);
      // this.afs.doc(`users/${this.uid}`).collection('forms').doc(this.formData.startTime).update(this.formData);
    } else {
      alert('Cannot Update, Form not available!');
    }
    this.router.navigateByUrl('/user-manage');
  }

  ngOnInit() {
  }

}
