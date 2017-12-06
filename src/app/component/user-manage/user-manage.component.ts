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
    
  deleteUser(user: UserInfo){
    this.userDoc = this.afs.doc(`users/${this.userInfo.uid}`);
    this.userDoc.delete();
  }

  ngOnInit() {
  }

}
