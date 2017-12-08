import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';   
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { AuthService } from '../../provider/auth.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { UserInfo } from '../../model/user-info';

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

  constructor(private afs: AngularFirestore, 
              public authService: AuthService, 
              private router:Router,
              private route: ActivatedRoute) { 
    this.usersCol = this.afs.collection<UserInfo>('users');
    this.users = this.usersCol.snapshotChanges().map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data() as UserInfo;
        const id = a.payload.doc.id;
        return data;
      });
    });
  }
    
  deleteClick(userId){
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
