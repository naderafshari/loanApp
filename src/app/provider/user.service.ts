import { Injectable } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { UserInfo } from '../model/user-info';

@Injectable()
export class UserService {

  usersCol: AngularFirestoreCollection<UserInfo>;
  userDoc: AngularFirestoreDocument<UserInfo>;
  users: Observable<UserInfo[]>;

  constructor(private afs: AngularFirestore,
              public authService: AuthService,
              private router: Router,
              private route: ActivatedRoute) {
    this.usersCol = this.afs.collection<UserInfo>('users');
    this.users = this.usersCol.valueChanges();
/*   
    this.users = this.usersCol.snapshotChanges().map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data() as UserInfo;
        const id = a.payload.doc.id;
        return data;
      });
    });
*/
  }

  getUsers() {
    return this.users;
  }

  addUser(user: UserInfo) {
    this.usersCol.add(user);
  }

  deleteUser(user: UserInfo) {
    this.userDoc = this.afs.doc(`users/${user.uid}`);
    this.userDoc.delete();
  }

  updateUser(user: UserInfo) {
    user.updateTime = new Date().toString();
    this.userDoc = this.afs.doc(`users/${user.uid}`);
    return this.userDoc.update(user);
  }

}
