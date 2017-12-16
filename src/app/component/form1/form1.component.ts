import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { AuthService } from '../../provider/auth.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/forkJoin';
import { UserInfo } from '../../model/user-info';
import { Form } from '../../model/form';
import * as firebase from 'firebase';

@Component({
  selector: 'app-form1',
  templateUrl: './form1.component.html',
  styleUrls: ['./form1.component.css']
})
export class Form1Component implements OnInit {

  userDoc: any;
  form1: Observable<Form[]>;
  user: any;
  userInfo: UserInfo;
  uid: string;
  form1Data: Form;
  form1Ref: AngularFirestoreCollection<Form>;

  constructor(private afs: AngularFirestore,
    public authService: AuthService,
    private router: Router,
    private route: ActivatedRoute) {

    this.route.params.subscribe(params => {
      this.uid = params['uid'] || 0;
      authService.user.subscribe((user) => {
        this.user = user;
        if (user) {
         // console.log(this.uid);
          if (this.uid) {
            //this.form1 = this.afs.doc(`users/${this.uid}`).collection<Form>('form1').valueChanges();
            this.form1Ref = this.afs.doc(`users/${this.uid}`).collection<Form>('form1', ref => ref.orderBy('time', 'desc').limit(1));
            this.form1 = this.form1Ref.valueChanges();
          } else {
            //this.form1 = this.afs.doc(`users/${this.user.uid}`).collection<Form>('form1').valueChanges();
            this.form1Ref = this.afs.doc(`users/${this.user.uid}`).collection<Form>('form1', ref => ref.orderBy('time', 'desc').limit(1));
            this.form1 = this.form1Ref.valueChanges();
          }
           this.form1.subscribe((data) => {
             this.form1Data = data[0];
             console.log(this.form1Data); });
             //console.log(new Date());
        }
      });
    });
  }
  ngOnInit() {
  }

}
