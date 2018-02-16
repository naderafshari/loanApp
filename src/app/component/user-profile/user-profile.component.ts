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
import { UserService } from '../../provider/user.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
})

export class UserProfileComponent implements OnInit, OnDestroy {
  userDoc: Observable<{}>;
  userInfo: UserInfo;
  uid: string;
  uidDialog: string;
  shoppingCart: ShoppingCart;
  sub1: Subscription;
  sub2: Subscription;
  show_add = false;

  constructor(private afs: AngularFirestore, private us: UserService,
              public authService: AuthService, private location: Location, private scs: ShoppingCartService,
              private router: Router, private dialog: MatDialog, private route: ActivatedRoute) {

    this.route.params.subscribe(params => {
      this.uid = params['uid'] || 0;
      if (this.uid) {
        this.userDoc = this.afs.doc(`users/${this.uid}`).valueChanges();
      } else {
        this.userDoc = this.afs.doc(`users/${this.authService.currentUserId}`).valueChanges();
        this.uid = this.authService.currentUserId;
      }
      this.sub1 = this.userDoc.subscribe((data: UserInfo) => {
        this.userInfo = data;
      });
      // Figure out show or hide Add to Cart button
      if (this.authService.userFunction === 'lender' ||
          this.authService.userAuthRole === 'admin') {
        this.sub2 = this.afs.doc(`users/${this.authService.currentUserId}`).valueChanges()
        .subscribe((lender: UserInfo) => {
          if (lender) {
            if (lender.purchased.includes(this.uid)) {
              this.show_add = false;
            } else {
              this.show_add = true;
            }
          }
        });
      }
    });
  }

  goChangeEmail () {
    this.router.navigateByUrl('/email-change');
  }

  updateUser() {
    if (this.userInfo) {
      if (this.authService.userAuthRole === 'admin' && this.userInfo.role !== 'admin' &&
          this.authService.currentUserId === this.userInfo.uid) {
        alert('admin role cannot be changed by self');
        return;
      }
      if (this.allRequireFields()) {
        this.us.updateUser(this.userInfo);
        // We can be getting here after function page so goBack wouldn't work
        // The order of the conditions is important, don't move them
        if (this.authService.userAuthRole === 'admin') {
          this.router.navigateByUrl('/user-manage');
        } else if (this.authService.userFunction === 'borrower') {
          this.router.navigateByUrl('/borrower-portal');
        } else if (this.authService.userFunction === 'lender') {
          this.router.navigateByUrl('/lender-portal');
        } else {
          this.router.navigateByUrl('/user-function');
        }
      } else {
        alert('Required field was not filled!');
      }
    } else {
      alert('Cannot Update, user not logged in!');
      this.router.navigateByUrl('/login');
    }
  }

  openDialog(userId): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '250px',
      data: 'You are about to delete. Are you sure?'
    });
    this.uidDialog = userId;
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'Confirm') {
        this.deleteUser(this.uidDialog);
      }
    });
  }

  deleteUser(userId) {
    if (this.userInfo) {
      if (this.authService.currentUserId !== this.userInfo.uid) {
        this.afs.doc(`users/${userId}`).delete()
        .then(() => {
          if (this.authService.currentUserId === userId) {
            this.authService.deleteAuthCurrentUser();
            this.router.navigateByUrl('/login');
          } else {
            // this.router.navigateByUrl('/user-manage');
            this.goBack();
          }
        });
      } else {
        alert('Admin cannot delete self! Contact system admin');
      }
    }
  }

  allRequireFields() {
    if (this.userInfo.firstName && this.userInfo.lastName) {
      return true;
    }
    return false;
  }

  goBack() {
    this.location.back();
  }

  calculateCart(cart): number {
    let prices: number[] = [];
    cart.items.forEach(item => prices.push(item.price));
    return prices.reduce((a, b) => a + b, 0);
  }

  addToCart() {
    const catId = ''; // for now, wil change later
    const price = 30;
    this.scs.addItem(this.authService.currentUserId, this.userInfo.uid, catId, price);
  }

  goToCart() {
    this.router.navigate(['/lender-cart', this.authService.currentUserId]);
  }

  ngOnDestroy() {
    if (this.sub1) {
      this.sub1.unsubscribe();
    }
    if (this.sub2) {
      this.sub2.unsubscribe();
    }
  }

  ngOnInit() {
  }
}
