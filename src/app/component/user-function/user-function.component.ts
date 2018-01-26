import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../../provider/auth.service';
import { UserInfo } from '../../model/user-info';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-user-function',
  templateUrl: './user-function.component.html',
  styleUrls: ['./user-function.component.css']
})
export class UserFunctionComponent implements OnInit, OnDestroy {
 uid: string;
 user: any;
 userInfo: UserInfo;
 sub: Subscription;

  constructor(private afs: AngularFirestore, public authService: AuthService, 
    private router: Router, private route: ActivatedRoute ) {
      this.uid = this.authService.currentUserId;
      this.sub = this.afs.doc(`users/${this.uid}`).valueChanges()
      .subscribe((data: UserInfo) => this.userInfo = data);
}

  logout() {
    this.authService.logout();
  }

  clickNext() {
    this.afs.collection('users').doc(this.uid).update(this.userInfo);
    this.router.navigate(['/user-profile', this.uid]);
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
