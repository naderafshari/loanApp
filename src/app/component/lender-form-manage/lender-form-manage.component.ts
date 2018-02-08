import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DialogComponent } from '../dialog/dialog.component';
import { Form } from '../../model/form';
import { LenderFormService } from '../../provider/lender-form.service';
import { AuthService } from '../../provider/auth.service';
import { UserInfo } from '../../model/user-info';

@Component({
  selector: 'app-lender-form-manage',
  templateUrl: './lender-form-manage.component.html',
  styleUrls: ['./lender-form-manage.component.css']
})
export class LenderFormManageComponent implements OnInit {
  formsCol: AngularFirestoreCollection<Form>;
  forms: Observable<Form[]>;
  usedForms: number[];
  usersCol: AngularFirestoreCollection<UserInfo>;
  userDoc: AngularFirestoreDocument<UserInfo>;
  users: Observable<UserInfo[]>;
  userId: string;
  userInfo: UserInfo;

  constructor(private afs: AngularFirestore, private location: Location,
    private router: Router,   private route: ActivatedRoute, private authService: AuthService,
    private lfs: LenderFormService,  public dialog: MatDialog ) {
    }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.userId = params['uid'] || 0;
      if (this.userId) {
        this.usersCol = this.afs.collection<UserInfo>('users', ref => ref.where('uid', '==', this.userId));
        this.users = this.usersCol.valueChanges();
        this.users.subscribe((users) => {
          if (users) {
            this.userInfo = users[0];
            /* Setting up for add form. To find next available
            form, find the not-available ones first here (at init) */
            this.formsCol = this.afs.doc(`users/${this.authService.currentUserId}`).collection<Form>('forms');
            this.forms = this.formsCol.valueChanges();
            this.forms.subscribe(forms => {
              this.usedForms = [];
              forms.forEach(form => {
                this.usedForms.push(form.formNumber);
              });
            });
          }
        });
      }
    });
  }

  createForms() {
    // this.lfs.createAllForms();
  }

  editClick(id) {
    this.router.navigate(['/lender-form-config', id]);
  }

  addForm() {
      this.lfs.addForm(this.nextSlot(0, 'up'));
  }

  nextSlot(current, direction) {
    let inc = 1;
    if ( direction === 'down' ) {
        inc = -1;
    }
    const next = current + inc;
    for (let i = 0; i < this.usedForms.length; i++) {
      if ( Number(this.usedForms[i]) === next ) {
        return this.nextSlot(next , direction );
      }
    }
    return next ;
  }
/*
  openDeleteAllDialog(): void {
    if (this.userInfo.function === 'lender') {
      const dialogRef = this.dialog.open(DialogComponent, {
        width: '250px',
        data: 'You are about to Delete the forms. Form Configurartion will be cleared and form will be removed. Are you sure?'
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result === 'Confirm') {
          for (let i = 0; i < this.usedForms.length; i++) {
            this.lfs.deleteForm('form' + this.usedForms[i]);   <-------this part won't work
          }
        }
      });
    } else {
      alert('No Delete privilages! Please contact the Administrator');
    }
  }
*/
  openDeleteDialog(formId): void {
    if (this.userInfo.function === 'lender') {
      const dialogRef = this.dialog.open(DialogComponent, {
        width: '250px',
        data: 'You are about to Delete the forms. Form Configurartion will be cleared and form will be removed. Are you sure?'
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result === 'Confirm') {
          this.lfs.deleteForm(formId);
        }
      });
    } else {
      alert('No Delete privilages! Please contact the Administrator');
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '250px',
      data: 'You are about to Create or Re-create the forms. Re-creating will wipe out existing forms. Are you sure?'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'Confirm') {
        this.createForms();
      }
    });
  }

  goBack() {
    this.location.back();
  }
}
