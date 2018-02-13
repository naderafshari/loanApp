import { Component, OnInit, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DialogComponent } from '../dialog/dialog.component';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../../provider/auth.service';
import { UserService } from '../../provider/user.service';
import { UserInfo } from '../../model/user-info';
import { Message } from '../../model/message';

@Component({
  selector: 'app-msg-inbox',
  templateUrl: './msg-inbox.component.html',
  styleUrls: ['./msg-inbox.component.css']
})
export class MsgInboxComponent implements OnInit {
  usersCol: AngularFirestoreCollection<UserInfo>;
  userDoc: AngularFirestoreDocument<UserInfo>;
  users: any;
  userInfo: UserInfo;
  sub: Subscription;
  inboxes: Message[];
  next_page_url: string;
  previous_page_url: string;
  next_page_disable: boolean;
  previous_page_disable: boolean;
  show_success_msg = false;
  inbox_empty = true;
  success_msg: string;
  displayName: string;

  constructor(private afs: AngularFirestore, public dialog: MatDialog,
    public authService: AuthService, private router: Router,
    private route: ActivatedRoute ) {
}

ngOnInit() {
    // this.sub = this.afs.doc<UserInfo>(`users/${this.authService.currentUserId}`)
    // .valueChanges().subscribe((data) => {
    //   this.userInfo = data;
    // });
    this.sub = this.afs.collection<Message>('messages', ref => ref.where('rid', '==', this.authService.currentUserDisplayName))
    .valueChanges().subscribe((data) => {
      this.inboxes = data;
      this.displayName = this.authService.currentUserDisplayName;
      if (this.inboxes && this.inboxes.length <= 0) {
        this.inbox_empty = true;
      }
    });
}

}
