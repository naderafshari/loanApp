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
export class MsgInboxComponent implements OnInit, OnDestroy {
  sub: Subscription;
  messages: Message[];
  next_page_url: string;
  previous_page_url: string;
  next_page_disable: boolean;
  previous_page_disable: boolean;
  show_success_msg = false;
  inbox_empty = false;
  success_msg: string;
  displayName: string;

  constructor(private afs: AngularFirestore, public dialog: MatDialog,
    public authService: AuthService, private router: Router,
    private route: ActivatedRoute ) {
}

  ngOnInit() {
    this.sub = this.afs.collection<Message>('messages', ref => ref.where('rid', '==', this.authService.currentUserId))
    .valueChanges().subscribe((data) => {
      this.messages = data;
      // Sort with the latest first
      this.messages.sort(this.compareTime);
      // Grab just the new part of the message
      this.messages.map((e) => e.message = e.message.split('-------------Reply above')[0]);
      this.displayName = this.authService.currentUserDisplayName;
      if (this.messages.length !== 0) {
        this.inbox_empty = false;
      } else {
        this.inbox_empty = true;
      }
    });
  }

  compareTime(a, b) {
    if (a.timeStamp < b.timeStamp) {
      return -1;
    }
    if (a.timeStamp > b.timeStamp) {
      return 1;
    }
    return 0;
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  reply(sid, mid) {
    if (sid && mid) {
      this.router.navigate(['/msg-compose', sid, mid]);
    }
  }

  delete(mid) {
    if (mid) {
      this.afs.doc<Message>(`messages/${mid}`).delete();
    }
  }
}
