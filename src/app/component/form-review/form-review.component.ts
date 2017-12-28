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
          this.formData = data[0];
          //console.log(this.formData)
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





