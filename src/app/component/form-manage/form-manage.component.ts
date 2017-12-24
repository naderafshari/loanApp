import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DialogComponent } from '../dialog/dialog.component';
import { Form } from '../../model/form';
import { FormConfigComponent } from '../form-config/form-config.component';
import { FormService } from '../../provider/form.service';

@Component({
  selector: 'app-form-manage',
  templateUrl: './form-manage.component.html',
  styleUrls: ['./form-manage.component.css']
})
export class FormManageComponent implements OnInit {
  formsCol: AngularFirestoreCollection<Form>;
  userDoc: AngularFirestoreDocument<Form>;
  forms: Observable<Form[]>;

  constructor(private afs: AngularFirestore,
    private router: Router,   private route: ActivatedRoute,
    private fs: FormService,  public dialog: MatDialog ) {
  }

  ngOnInit() {
    this.forms = this.fs.getForms();
  }

  createForms() {
    this.fs.createForms();
  }

  editClick(id) {
    this.router.navigate(['/form-config', id]);
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
