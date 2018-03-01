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
export class PaymentService {

  userId: string;

  constructor(private afs: AngularFirestore, private authService: AuthService) {
    this.userId = authService.currentUserId;
  }

  processPayment(token: any, amount: number) {
    const uid = this.userId;
    const time = new Date().toString();
    const payment = {
      uid,
      time,
      token,
      amount
    };
    return this.afs.doc(`/payments/${this.afs.createId()}`).set(payment);
  }

}

