import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { AuthService } from '../../provider/auth.service';
import { Observable } from 'rxjs/Observable';
import { Form } from '../../model/form';
import { FormService } from '../../provider/form.service';

@Component({
  selector: 'app-form-assign',
  templateUrl: './form-assign.component.html',
  styleUrls: ['./form-assign.component.css']
})
export class FormAssignComponent implements OnInit {
  uid: string;
  forms: Observable<Form[]>;
  formsArray: Form[];

  constructor(private afs: AngularFirestore,
              private router: Router,
              private route: ActivatedRoute,
              public fs: FormService) {
    this.route.params.subscribe(params => {
      this.uid = params['uid'] || 0;
      if (this.uid) {
        this.forms = this.fs.getForms();
        // console.log(this.forms);
        }
    });
  }

  assignClick(formId) {
    const form = this.afs.collection<Form>('forms', ref => ref.where('formId', '==', formId)).valueChanges();
    form.subscribe((data) => {
        this.formsArray = data;
        this.formsArray[0].updateTime = new Date().toString();
        this.formsArray[0].startTime = new Date().toString();
        this.afs.doc(`users/${this.uid}`).collection('forms').doc(new Date().toString()).set(this.formsArray[0]);
        alert('Form assigned successfully.');
        this.router.navigateByUrl('/user-manage');
    });
  }

  ngOnInit() {
  }

}
