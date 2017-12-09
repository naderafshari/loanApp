import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';   
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { AuthService } from '../../provider/auth.service';
import { DialogComponent } from '../dialog/dialog.component';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { UserInfo } from '../../model/user-info';
import { MatCardModule } from '@angular/material';
import { MatButtonModule } from '@angular/material';
import { MatDialogModule } from '@angular/material';
import { MatTooltipModule } from '@angular/material';
import { MatSnackBarModule } from '@angular/material';

@Component({
  selector: 'app-user-manage',
  templateUrl: './user-manage.component.html',
  styleUrls: ['./user-manage.component.css']
})
export class UserManageComponent implements OnInit {
  userInfo: any;
  usersCol: AngularFirestoreCollection<UserInfo>;
  userDoc: AngularFirestoreDocument<UserInfo>;  
  users: Observable<UserInfo[]>;
  user: any;
  dialogResult = "";

  constructor(private afs: AngularFirestore, 
              public authService: AuthService, private router:Router,
              private route: ActivatedRoute, public dialog: MatDialog) { 
    this.usersCol = this.afs.collection<UserInfo>('users');
    this.users = this.usersCol.snapshotChanges().map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data() as UserInfo;
        const id = a.payload.doc.id;
        return data;
      });
    });
  }

  openDialog(): void {
    let dialogRef = this.dialog.open(DialogComponent, {
      width: '250px',
      data: 'This text is passed into the dialog'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.dialogResult = result;
      if (result === 'Confirm')
      {
        this.deleteUser('');
      }
    });
  }
    
  deleteUser(userId){
    this.userDoc = this.afs.doc(`users/${userId}`);
    if (this.userDoc){
      this.userDoc.valueChanges().subscribe((data)=>{
        if(data){
          if(data.role !== 'admin'){
            this.userDoc.delete();
            this.authService.deleteAuthCurrentUser()
          }
          else {
            alert("Admin user cannot be deleted here! Contact system admin");
          }
        }//data
        else { 
          this.router.navigateByUrl('/login');
        }
      });
    }//userDoc
    else {
      this.router.navigateByUrl('/login');
    }
  }

  editClick(uid) {
    this.router.navigate(['/user-profile', uid]);
  }
  
  logout() {
    this.authService.logout();
  }

  ngOnInit() {
  }

}
