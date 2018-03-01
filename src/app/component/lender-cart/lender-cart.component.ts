import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { AuthService } from '../../provider/auth.service';
import { ShoppingCartService } from '../../provider/shopping-cart.service';
import { Observable } from 'rxjs/Observable';
import { UserInfo } from '../../model/user-info';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DialogComponent } from '../dialog/dialog.component';
import { ShoppingCart, CartItem } from '../../model/cart';
import { Subscription } from 'rxjs/Subscription';
import { UserService } from '../../provider/user.service';
import { PaymentService } from '../../provider/payment.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-lender-cart',
  templateUrl: './lender-cart.component.html',
  styleUrls: ['./lender-cart.component.css']
})
export class LenderCartComponent implements OnInit {
  userDoc: Observable<UserInfo>;
  uid: string;
  uidDialog: string;
  shoppingCart: ShoppingCart;
  items: any[] = [];
  sub1: Subscription;
  userInfo: UserInfo;
  handler: any;
  amount = 0;

  constructor(private afs: AngularFirestore, private scs: ShoppingCartService, private paymentSvc: PaymentService,
              public authService: AuthService, private location: Location, private us: UserService,
              private router: Router, private dialog: MatDialog, private route: ActivatedRoute) {

    this.route.params.subscribe(params => {
      this.uid = params['uid'] || 0;   // uid is the logged in user(lender) if not admin
      if (this.uid) {
        this.userDoc = this.afs.doc<UserInfo>(`users/${this.uid}`).valueChanges();
      } else { // Should not be needed because we should route with the parameter passed to it, make sure
        this.userDoc = this.afs.doc<UserInfo>(`users/${this.authService.currentUserId}`).valueChanges();
        this.uid = this.authService.currentUserId;
      }
      this.sub1 = this.scs.getCart(this.uid).subscribe((data: ShoppingCart) => {
        this.shoppingCart = data;
        this.items = [];
        if (typeof this.shoppingCart.items !== 'undefined' && this.shoppingCart.items.length > 0) {
          this.configPayment();
          this.shoppingCart.items.forEach((item) => {
            const sub = this.afs.doc<UserInfo>(`users/${item.itemId}`).valueChanges().subscribe((user) => {
              this.items.push({
                'uid': user.uid,
                'displayName': user.displayName,
                'price': item.price,
                'dob': user.dob,
                'photoURL': user.photoURL,
                'joinTime': user.joinTime
              });
              sub.unsubscribe();
            });
          });
        }
      });
    });
  }

  emptyCart() {
    this.scs.emptyCart(this.uid);
  }

  openEmptyDialog(): void {
    if (this.shoppingCart.items.length > 0) {
      const dialogRef = this.dialog.open(DialogComponent, {
        width: '250px',
        data: 'You are about to remove all items from shopping cart. Are you sure?'
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result === 'Confirm') {
          this.emptyCart();
        }
      });
    }
  }

  removeFromCart(userId) {
    this.scs.removeItem(this.uid, userId, '');
  }

  goToCheckout() {
    const sub = this.userDoc.subscribe((lender) => {
      this.userInfo = lender;
      if (typeof this.userInfo.purchased === 'undefined') {
        this.userInfo.purchased = [];
      }
      this.shoppingCart.items.forEach((cartItem) => {
        const purchasedUser = this.userInfo.purchased.filter(e => e === cartItem.itemId); // && e === cartItem.catId);
        if (purchasedUser.length > 0) {
          alert('user already purchased, skipping');
        } else {
          this.userInfo.purchased.push(cartItem.itemId);
          this.amount += cartItem.price * 100;
        }
      });
      if (this.amount > 0 ) {
        this.handlePayment();
      } else {
        alert('Cart value is zero, nothing to check out!');
      }
      // alert('The transaction has been completed!');
      this.us.updateUser(this.userInfo);
      this.emptyCart();
      sub.unsubscribe();
    });
  }

  goToPortal() {
    this.router.navigateByUrl('/lender-portal');
  }

  goBack() {
    this.location.back();
  }

  ngOnInit() {
  }

  configPayment() {
    this.handler = StripeCheckout.configure({
      key: environment.stripeKey,
      // image: '/your/awesome/logo.jpg',
      locale: 'auto',
      token: token => {
        this.paymentSvc.processPayment(token, this.amount);
      }
    });
  }

  handlePayment() {
    this.handler.open({
      name: 'FireStarter',
      excerpt: 'Deposit Funds to Account',
      amount: this.amount
    });
  }

  @HostListener('window:popstate')
    onPopstate() {
      this.handler.close();
    }

}
