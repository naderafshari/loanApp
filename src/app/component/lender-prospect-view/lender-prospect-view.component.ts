import { Component, ViewChild, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { AuthService } from '../../provider/auth.service';
import { LenderFormService } from '../../provider/lender-form.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/forkJoin';
import { UserInfo } from '../../model/user-info';
import { Form } from '../../model/form';
import { Subscription } from 'rxjs/Subscription';
import { MatTableDataSource, MatSort } from '@angular/material';
import { MatPaginator } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DialogComponent } from '../dialog/dialog.component';
import { ShoppingCartService } from './../../provider/shopping-cart.service';

@Component({
  selector: 'app-lender-prospect-view',
  templateUrl: './lender-prospect-view.component.html',
  styleUrls: ['./lender-prospect-view.component.css']
})
export class LenderProspectViewComponent implements OnDestroy {
  // catId: string;
  formData: Form;
  userDoc: Observable<{}>;
  user: any;
  sub: Subscription;
  usersInfo: any[] = [];
  displayedColumns = ['select', 'addToCart', 'displayName', 'dob', 'joinedTime'];
  dataSource: any;
  selection: any;
  sub1: Subscription;
  // authUser: UserInfo;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private afs: AngularFirestore, private router: Router, private location: Location,
              private route: ActivatedRoute, public dialog: MatDialog, private scs: ShoppingCartService,
              private authService: AuthService) {
              // public authService: AuthService) {
      // this.sub = this.route.params.subscribe(params => {
      // this.catId = params['catid'] || 0;
      // if (this.catId) {
      //  this.sub1 = this.afs.doc<UserInfo>(`users/${this.authService.currentUserId}`)
      //  .valueChanges().subscribe((authUser) => {
      //    if (authUser) {
      //      this.authUser = authUser;
      //    }
      this.sub1 = this.afs
      .collection<UserInfo>('users', ref => ref.where('function', '==', 'borrower').where('role', '==', 'user')).valueChanges()
      .subscribe((users: UserInfo[]) => {
        users.forEach((user: UserInfo) => {
          const userData = {
            'uid': user.uid,
            'displayName': user.displayName,
            'dob': user.dob,
            'joinedTime': user.joinedTime
          };
          this.usersInfo.push(userData);
        });
        this.dataSource = new MatTableDataSource<Form>(this.usersInfo);
        this.selection = new SelectionModel<Form>(true, []);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }); // user, borrower
      //  }); // authUser
      // } catId
    // });
  }

  addToCart(uid) {
    const catId = ''; // for now, wil change later
    const price = 30;
    this.scs.addItem(this.authService.currentUserId, uid, catId, price);
  }

  viewSelected() {
    if (this.selection.selected[1]) {
      alert('More than one item was selected! Please, select only one item.');
    } else if (this.selection.selected[0]) {
      this.router.navigate(['/user-profile', this.selection.selected[0].uid]);
    } else {
      alert('No item was selected! Please, select one item.');
    }
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.dataSource.data.forEach(row => this.selection.select(row));
  }

  goBack() {
    this.location.back();
  }

  goToCart() {
    this.router.navigate(['/lender-cart', this.authService.currentUserId]);
  }

  ngOnDestroy() {
    // this.sub.unsubscribe();
    if (this.sub1) {
      this.sub1.unsubscribe();
    }
  }
}
