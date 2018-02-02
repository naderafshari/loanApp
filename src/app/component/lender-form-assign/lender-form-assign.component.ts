import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { AuthService } from '../../provider/auth.service';
import { UserInfo } from '../../model/user-info';
import { Observable } from 'rxjs/Observable';
import { Form } from '../../model/form';
import { LenderFormService } from '../../provider/lender-form.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-lender-form-assign',
  templateUrl: './lender-form-assign.component.html',
  styleUrls: ['./lender-form-assign.component.css']
})
export class LenderFormAssignComponent implements OnInit, OnDestroy {
  uid: string;
  forms: Observable<Form[]>;
  formData: Form;
  userDoc: Observable<{}>;
  user: any;
  userInfo: UserInfo;
  sub: Subscription;

  constructor(private afs: AngularFirestore,
              private authService: AuthService,
              private router: Router, private location: Location,
              private route: ActivatedRoute,
              public lfs: LenderFormService) {
    this.route.params.subscribe(params => {
      this.uid = params['uid'] || 0;
      if (this.uid) {
        this.forms = this.lfs.getForms();
        this.userDoc = this.afs.doc(`users/${this.uid}`).valueChanges();
        this.sub = this.userDoc.subscribe((data: UserInfo) => this.userInfo = data);
      }
    });
  }

  assignClick(formId) {
    this.lfs.assignForm(formId, this.uid);
    alert('Form assigned successfully.');
    this.goBack();
  }

  unAssignClick(formId) {
    this.lfs.unAssignForm(formId, this.uid);
    alert('Form Unassigned successfully.');
    this.goBack();
  }

  goBack() {
    this.location.back();
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }
}
