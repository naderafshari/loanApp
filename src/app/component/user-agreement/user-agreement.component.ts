import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../../provider/auth.service';
import { ShoppingCartService } from '../../provider/shopping-cart.service';
import { UserInfo } from '../../model/user-info';
import { Form } from '../../model/form';
import { Subscription } from 'rxjs/Subscription';
import { UserService } from '../../provider/user.service';

@Component({
  selector: 'app-user-agreement',
  templateUrl: './user-agreement.component.html',
  styleUrls: ['./user-agreement.component.css']
})
export class UserAgreementComponent implements OnInit, OnDestroy {
 userInfo: UserInfo;
 sub1: Subscription;
 sub2: Subscription;
 agreement: any;

  constructor(private afs: AngularFirestore, public authService: AuthService, private us: UserService,
    private router: Router, private route: ActivatedRoute, private scs: ShoppingCartService,
    private location: Location) {
      this.sub1 = this.afs.doc(`users/${this.authService.currentUserId}`).valueChanges()
      .subscribe((data: UserInfo) => {
        if (data) {
          this.userInfo = data;
          if (this.userInfo.function === 'borrower' || this.userInfo.function === 'lender') {
            this.sub1 = this.afs.doc(`agreements/${this.userInfo.function}`)
            .valueChanges().subscribe((agreement: any) => {
              this.agreement = agreement.text;
            });
          } else { /** function was not set properly */
            this.router.navigateByUrl('/user-function');
          }
        }
      });
  }

  clickNext() {
    this.userInfo.updateTime = new Date().toString();
    if (this.userInfo.agree === 'no') {
      this.userInfo.function = ''; /* Rest the user in case he came back */
    }
    this.us.updateUser(this.userInfo)
    .then(() => {
      if (this.userInfo.agree === 'yes') {
        this.router.navigate(['/user-profile', this.userInfo.uid]);
      } else {
        this.authService.logout();
      }
    });
  }

  clickBack() {
      this.location.back();
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
