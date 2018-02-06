import { Injectable } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { ShoppingCart, ShoppingCartClass, CartItem } from '../model/cart';
import { UserInfo } from '../model/user-info';
import { AuthService } from './auth.service';
import { observeOn } from 'rxjs/operator/observeOn';

@Injectable()
export class ShoppingCartService {
  cartCol: AngularFirestoreCollection<ShoppingCart>;
  userCol: AngularFirestoreCollection<UserInfo>;
  userDoc: AngularFirestoreDocument<UserInfo>;
  shoppingCart: ShoppingCartClass;
  sub: Subscription;

  constructor(private afs: AngularFirestore, private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute) {
  }

  createCart(uid) {
    /* Called only once for a new lender*/
    const shoppingCart = new ShoppingCartClass();
    this.afs.doc(`carts/${uid}`).set(shoppingCart.getObject())
    .then(() => console.log('shopping cart created for lender'))
    .catch((err) => console.log(err));
  }

  updateCart(uid, shoppingCart) {
    shoppingCart.updateTime = new Date().toString();
    this.afs.doc(`carts/${uid}`).update(shoppingCart)
    .then(() => console.log('shopping cart updated for lender'))
    .catch((err) => console.log(err));
  }

  emptyCart(uid) {
    const cart = new ShoppingCartClass();
    this.updateCart(uid, cart.getObject());
  }

  getCart(uid): any {
    if (uid) {
      return this.afs.doc(`carts/${uid}`).valueChanges();
    }
    return Observable.of(null);
  }

  addItem(uid, itemId, catId, price) {
    const sub = this.getCart(uid).subscribe((cart) => {
      if (cart) {
        let shoppingCart: ShoppingCart = cart;
        let alreadyAddedUser: CartItem[] = [];
        if (typeof shoppingCart.items !== 'undefined' && shoppingCart.items.length > 0) {
          alreadyAddedUser = shoppingCart.items.filter((item) => item.itemId === itemId && item.catId === catId);
        }
        if (alreadyAddedUser.length > 0) {
          alert('Borrower already added to the cart');
        } else {
          shoppingCart.items.push({'itemId': itemId, 'catId': catId, 'price': price});
          shoppingCart.itemsTotal = this.calculateCart(shoppingCart);
          this.updateCart(uid, shoppingCart);
          alert('Borrower added to shopping cart successfuly');
        }
        sub.unsubscribe();
      }
    });
  }

  removeItem(uid, itemId, catId) {
    const sub = this.getCart(uid).subscribe((cart) => {
      if (cart) {
        let shoppingCart: ShoppingCart = cart;
        const cartItem = shoppingCart.items.filter((item) => item.itemId === itemId && item.catId === catId);
        const index = shoppingCart.items.indexOf(cartItem[0]);
        if (index > -1) {
          shoppingCart.items.splice(index, 1);
          shoppingCart.itemsTotal = this.calculateCart(shoppingCart);
          this.updateCart(uid, shoppingCart);
        }
        sub.unsubscribe();
      }
    });
  }

  calculateCart(cart): number {
    let prices: number[] = [];
    cart.items.forEach(item => prices.push(item.price));
    return prices.reduce((a, b) => a + b, 0);
  }
}
