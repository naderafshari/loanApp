import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DialogComponent } from '../dialog/dialog.component';
import { Form } from '../../model/form';
import { FormConfigComponent } from '../form-config/form-config.component';
import { FormService } from '../../provider/form.service';
import { AuthService } from '../../provider/auth.service';
import { UserInfo } from '../../model/user-info';

@Component({
  selector: 'app-form-manage',
  templateUrl: './form-manage.component.html',
  styleUrls: ['./form-manage.component.css']
})
export class FormManageComponent implements OnInit {
  formsCol: AngularFirestoreCollection<Form>;
  forms: Observable<Form[]>;
  usedForms: string[];
  usersCol: AngularFirestoreCollection<UserInfo>;
  userDoc: AngularFirestoreDocument<UserInfo>;
  users: Observable<UserInfo[]>;
  userId: string;
  userInfo: UserInfo;

  constructor(private afs: AngularFirestore,
    private router: Router,   private route: ActivatedRoute,
    private fs: FormService,  public dialog: MatDialog ) {
    }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.userId = params['uid'] || 0;
      if (this.userId) {
        this.usersCol = this.afs.collection<UserInfo>('users', ref => ref.where('uid', '==', this.userId));
        this.users = this.usersCol.valueChanges();
        this.users.subscribe((users) => {
          if (users) {this.userInfo = users[0];
          }
        });
        /* Setting up for add form. To find next available
        form, find the not-available ones first here (at init) */
        this.formsCol = this.afs.collection<Form>('forms');
        this.forms = this.formsCol.valueChanges();
        this.forms.subscribe(forms => {
          this.usedForms = [];
          forms.forEach(form => {
            this.usedForms.push(form.formId.charAt(4) + form.formId.charAt(5));
          });
        });
      }
    });
  }

  createForms() {
    this.fs.createAllForms();
  }

  editClick(id) {
    this.router.navigate(['/form-config', id]);
  }

  addForm() {
      this.fs.addForm(this.nextSlot(0, 'up'));
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

  openDeleteAllDialog(): void {
    if (this.userInfo.role === 'admin') {
      const dialogRef = this.dialog.open(DialogComponent, {
        width: '250px',
        data: 'You are about to Delete the forms. Form Configurartion will be cleared and form will be removed. Are you sure?'
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result === 'Confirm') {
          for (let i = 0; i < this.usedForms.length; i++) {
            this.fs.deleteForm('form' + this.usedForms[i]);
          }
        }
      });
    } else {
      alert('No Delete privilages! Please contact the Administrator');
    }
  }

  openDeleteDialog(formId): void {
    if (this.userInfo.role === 'admin') {
      const dialogRef = this.dialog.open(DialogComponent, {
        width: '250px',
        data: 'You are about to Delete the forms. Form Configurartion will be cleared and form will be removed. Are you sure?'
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result === 'Confirm') {
          this.fs.deleteForm(formId);
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

}
