import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../../provider/auth.service';
import { ShoppingCartService } from '../../provider/shopping-cart.service';
import { UserInfo } from '../../model/user-info';
import { Form } from '../../model/form';
import { Subscription } from 'rxjs/Subscription';
import { UserService } from '../../provider/user.service';

@Component({
  selector: 'app-user-function',
  templateUrl: './user-function.component.html',
  styleUrls: ['./user-function.component.css']
})
export class UserFunctionComponent implements OnInit, OnDestroy {
 uid: string;
 user: any;
 userInfo: UserInfo;
 sub1: Subscription;
 sub2: Subscription;

  constructor(private afs: AngularFirestore, public authService: AuthService, private us: UserService,
    private router: Router, private route: ActivatedRoute, private scs: ShoppingCartService) {
      this.uid = this.authService.currentUserId;
      this.sub1 = this.afs.doc(`users/${this.uid}`).valueChanges()
      .subscribe((data: UserInfo) => {
        this.userInfo = data;
        // Default to borrower
        if (typeof this.userInfo.function === 'undefined' || this.userInfo.function === '') {
            this.userInfo.function = 'borrower';
        }
      });
}

  logout() {
    this.authService.logout();
  }

  clickNext() {
    const form = this.afs.collection<Form>('forms', ref => ref.where('formName', '==', 'auto')).valueChanges();
    this.sub2 = form.subscribe((data) => {
      if (data[0]) {
        let formData = data[0];
        formData.formCreator = this.userInfo.uid;
        formData.updateTime = new Date().toString();
        formData.startTime = new Date().toString();
        const formId = 'form1'; // this.afs.createId();
        formData.formId = formId;
        if (this.userInfo.function === 'lender') {
          this.afs.doc(`users/${this.userInfo.uid}`).collection('forms').doc('auto').set(formData);
        } else if (this.userInfo.function === 'borrower') {
          this.afs.doc(`users/${this.userInfo.uid}`).collection('forms').doc(new Date().toString()).set(formData);
        }
        this.userInfo.assignedForms[formId] = this.userInfo.uid;
      }
      if (this.userInfo) {
        if (this.userInfo.function === 'lender') {
          this.scs.createCart(this.userInfo.uid);
        }
        this.userInfo.joinTime = new Date().toString();
        this.us.updateUser(this.userInfo)
        .then(() =>
          this.router.navigateByUrl('/user-agreement')
        );
      }
    });
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    if (this.sub1) {
      this.sub1.unsubscribe();
    }
    if (this.sub2) {
      this.sub2.unsubscribe();
    }
  }
}
