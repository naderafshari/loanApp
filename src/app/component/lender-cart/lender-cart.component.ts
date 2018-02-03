import { Component, OnInit, OnDestroy } from '@angular/core';
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

@Component({
  selector: 'app-lender-cart',
  templateUrl: './lender-cart.component.html',
  styleUrls: ['./lender-cart.component.css']
})
export class LenderCartComponent implements OnInit {
  userDoc: Observable<{}>;
  uid: string;
  uidDialog: string;
  shoppingCart: ShoppingCart;
  items: any[] = [];
  sub1: Subscription;
  userInfo: UserInfo;

  constructor(private afs: AngularFirestore,
              public authService: AuthService, private location: Location, private scs: ShoppingCartService,
              private router: Router, private dialog: MatDialog, private route: ActivatedRoute) {

    this.route.params.subscribe(params => {
      this.uid = params['uid'] || 0;   //uid is the logged in user if not admin
      if (this.uid) {
        this.userDoc = this.afs.doc(`users/${this.uid}`).valueChanges();
      } else { // Should not be needed because we should route with the parameter passed to it, make sure
        this.userDoc = this.afs.doc(`users/${this.authService.currentUserId}`).valueChanges();
        this.uid = this.authService.currentUserId;
      }
      this.sub1 = this.userDoc.subscribe((data: UserInfo) => {
        this.userInfo = data;
        this.shoppingCart = data.cart;
        this.items = [];
        this.shoppingCart.items.forEach((item) => {
            const sub = this.afs.doc<UserInfo>(`users/${item.itemId}`).valueChanges().subscribe((user) => {
              this.items.push({
                'uid': user.uid,
                'displayName': user.displayName,
                'dob': user.dob,
                'photoURL': user.photoURL,
                'joinedTime': user.joinedTime
              })
              sub.unsubscribe();
            });
          });
            });
    });
  }

  calculateCart(cart): number {
    let prices: number[] = [];
    cart.items.forEach(item => prices.push(item.price));
    return prices.reduce((a, b) => a + b, 0);
  }

  removeFromCart(userId) {
    const item = this.shoppingCart.items.filter(item => item.itemId == userId);
    const index = this.shoppingCart.items.indexOf(item[0]);
    if (index > -1) {
      this.shoppingCart.items.splice(index, 1);
      this.shoppingCart.itemsTotal = this.calculateCart(this.shoppingCart);
      this.scs.updateCart(this.uid, this.shoppingCart);
    }
  }

  goBack() {
    this.location.back();
  }

  ngOnInit() {
  }

}
