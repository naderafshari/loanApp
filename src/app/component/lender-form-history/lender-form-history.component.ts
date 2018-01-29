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

@Component({
  selector: 'app-lender-form-history',
  templateUrl: './lender-form-history.component.html',
  styleUrls: ['./lender-form-history.component.css']
})

export class LenderFormHistoryComponent implements OnDestroy {
  uid: string;
  formData: Form;
  userDoc: Observable<{}>;
  user: any;
  userInfo: UserInfo;
  sub: Subscription;
  formsInfo: Form[] = [];
  displayedColumns = ['select', 'formId', 'formName', 'startTime', 'updateTime'];
  dataSource: any;
  selection: any;
  sub1: Subscription;
  sub2: Subscription;
  sub3: Subscription;
  authUser: UserInfo;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private afs: AngularFirestore, private router: Router, private location: Location,
              private route: ActivatedRoute, public dialog: MatDialog,
              public authService: AuthService) {
      this.sub = this.route.params.subscribe(params => {
      this.uid = params['uid'] || 0;
      if (this.uid) {
        this.sub1 = this.afs.doc<UserInfo>(`users/${this.authService.currentUserId}`)
        .valueChanges().subscribe((authUser) => {
          if (authUser) {
            this.authUser = authUser;
          }
          this.formsInfo = [];
          this.userDoc = this.afs.doc(`users/${this.uid}`).valueChanges();
          this.sub2 = this.userDoc.subscribe((data: UserInfo) => {
            this.userInfo = data;
            if (this.userInfo) {
              this.sub3 = this.afs.doc(`users/${this.uid}`)
              .collection<Form>('forms', ref => ref.where('formCreator', '==', this.authService.currentUserId)).valueChanges()
              .subscribe((forms: Form[]) => {
                forms.forEach((form: Form) => {
                  const formInfo = {
                    'formId': form.formId,
                    'formName': form.formName,
                    'startTime': form.startTime,
                    'updateTime': form.updateTime
                  };
                  this.formsInfo.push(formInfo);
                });
                this.dataSource = new MatTableDataSource<Form>(this.formsInfo);
                this.selection = new SelectionModel<Form>(true, []);
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
              }); // user, borrower forms
            }
          }); // user, borrower
        }); // authUser
      }
    });
  }

  viewSelected() {
    if (this.selection.selected[1]) {
      alert('More than one item was selected! Please, select only one item.');
    } else if (this.selection.selected[0]) {
      this.router.navigate(['/form-review', this.uid, this.selection.selected[0].updateTime]);
    } else {
      alert('No item was selected! Please, select one item.');
    }
  }

  openDeleteDialog(): void {
    if (this.selection.selected[0]) {
      if (this.authService.userAuthRole === 'admin') {
        const dialogRef = this.dialog.open(DialogComponent, {
          width: '250px',
          data: 'You are about to Delete form record(s) for the selected user. There is no recovery once deleted. Are you sure?'
        });

        dialogRef.afterClosed().subscribe(result => {
          if (result === 'Confirm') {
            this.deleteSelection();
          }
        });
      } else {
        alert('No Delete privilages! Please contact the Administrator');
      }
    } else {
      alert('No item was selected! Please, select one item.');
    }
  }

  deleteSelection() {
    const breakException = {};
    try {
      this.selection.selected.forEach((selection) => {
        const formColRef = this.afs.doc(`users/${this.uid}`).collection<Form>('forms', ref =>
          ref.where('updateTime', '==', selection.updateTime));
        formColRef.valueChanges().subscribe((forms) => {
          if (forms[0]) {
            if (this.userInfo.assignedForms[forms[0].formId] === 'true') {
              alert('Assinged Forms history cannot be deleted. Unassign Form before deleting history.');
              this.router.navigateByUrl('/user-manage');
              throw breakException;
            }
          }
          formColRef.doc(`${selection.updateTime}`).delete();
          this.router.navigateByUrl('/user-manage');
        });
      });
    } catch (e) {
    if (e !== breakException) {
      throw e;
      }
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

  ngOnDestroy() {
    this.sub.unsubscribe();
    this.sub1.unsubscribe();
    this.sub2.unsubscribe();
    this.sub3.unsubscribe();
  }
}
