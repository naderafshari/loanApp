import { Injectable } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { ShoppingCart, ShoppingCartClass, CartItem } from '../model/cart';
import { UserInfo } from '../model/user-info';
import { AuthService } from './auth.service';

@Injectable()
export class ShoppingCartService {
  cartCol: AngularFirestoreCollection<ShoppingCart>;
  userCol: AngularFirestoreCollection<UserInfo>;
  userDoc: AngularFirestoreDocument<UserInfo>;
  shoppingCart: ShoppingCartClass;
  sub: Subscription;
  uid: string;

  constructor(private afs: AngularFirestore, private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute) {
  }

  createCart(uid) {
    /* Called only once for a new lender*/
    const shoppingCart = new ShoppingCartClass();
    this.afs.doc(`users/${uid}`).set(shoppingCart.getObject())
    .then(() => console.log('shopping cart created for lender'))
    .catch((err) => console.log(err));
  }

  updateCart(uid, shoppingCart) {
    shoppingCart.updateTime = new Date().toString();
    let userInfo;
    const sub = this.afs.doc(`users/${uid}`).valueChanges().subscribe((data) => {
      userInfo = data;
      userInfo.cart = shoppingCart;
      sub.unsubscribe();
      this.afs.doc(`users/${uid}`).update(userInfo)
      .then(() => console.log('shopping cart updated for lender'))
      .catch((err) => console.log(err));
    });
  }

  emptyCart(uid) {
    const cart = new ShoppingCartClass();
    this.updateCart(uid, cart.getObject());
  }
/* not working right
  getCart(uid): any {
    if (uid) {
      this.afs.collection<UserInfo>('users', ref => ref.where('uid', '==', uid)).valueChanges()
      .switchMap(user => {
        if (user[0]) {
          return Observable.of(user[0].cart);
        } else {
          return Observable.of(null);
        }
      });
    }
  }

  addItem(uid, userId, catId, price) {
    this.getCart(uid).subscribe((cart) => {
      if (cart[0]) {
        cart[0].items.push({'itemId': userId, 'catId': catId, 'price': price});
        cart[0].itemsTotal = this.calculateCart(cart[0]);
        this.updateCart(uid, cart[0]);
      }
    })
    .unsubscribe();
  }

  deleteItem(uid, userId, catId) {
    this.getCart(uid).subscribe((cart) => {
      if (cart[0]) {
        cart[0].items.filter(e => (e.itemId !== userId) && (e.catId !== catId));
        cart[0].itemsTotal = this.calculateCart(cart[0]);
        this.updateCart(uid, cart[0]);
      }
    })
    .unsubscribe();
  }

  calculateCart(cart): number {
    let prices: number[] = [];
    cart.items.forEach(item => prices.push(item.price));
    return prices.reduce((a, b) => a + b, 0);
  }
  */
}
