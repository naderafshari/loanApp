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
  form1: Observable<Form[]>;
  user: any;
  uid: string;
  form1Data: Form;
  form1Ref: AngularFirestoreCollection<Form>;

  constructor(private afs: AngularFirestore,
    public authService: AuthService,
    private router: Router,
    private route: ActivatedRoute) {

    this.route.params.subscribe(params => {
      this.uid = params['uid'] || 0;
      // authService.user.subscribe((user) => {
        // this.user = user;
        // if (user) {
          if (this.uid) {
            this.form1Ref = this.afs.doc(`users/${this.uid}`).collection<Form>('form1', ref =>
              ref.orderBy('startTime', 'desc').limit(1));
            this.form1 = this.form1Ref.valueChanges();
          }// else {
            // this.form1Ref = this.afs.doc(`users/${this.user.uid}`).collection<Form>('form1', ref =>
            //   ref.orderBy('startTime', 'desc').limit(1));
            // this.form1 = this.form1Ref.valueChanges();
          // }
          this.form1.subscribe((data) => {
            this.form1Data = data[0];
            /* console.log(this.form1Data); */ });
        // }
      // });
    });
  }

  updateFormData() {
    if (this.form1Data != null ) {
      this.form1Data.updateTime = new Date().toString();
      /* Use somthing like this is you want to create a new record at every submit */
       this.afs.doc(`users/${this.uid}`).collection('form1').doc(this.form1Data.updateTime).set(this.form1Data);
      // this.afs.doc(`users/${this.uid}`).collection('form1').doc(this.form1Data.startTime).update(this.form1Data);
    } else {
      alert('Cannot Update, Form not available!');
    }
    this.router.navigateByUrl('/user-manage');
  }

  ngOnInit() {
  }

}
