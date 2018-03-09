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
import { PaginationService } from '../../provider/pagination.service';

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
  no_more_older = false;
  no_more_newer = false;
  first_msg_time = 0;
  last_msg_time = 0;
  current_first_msg_time = 0;
  current_last_msg_time = 0;
  sub_older_fired = false;
  sub_newer_fired = false;
  msg_per_page = 8;

  constructor(private afs: AngularFirestore, public dialog: MatDialog,
    public authService: AuthService, private router: Router, public page: PaginationService,
    private route: ActivatedRoute, private location: Location ) { }

  ngOnInit() {
    this.loadMsgs();
    // this.page.init('messages', 'timeStamp', 8, 'rid', this.authService.currentUserId, { reverse: true, prepend: false });
}

  loadMsgs() {
    this.sub = this.afs.collection<Message>('messages', ref => ref.where('rid', '==', this.authService.currentUserId)
    .orderBy('timeStamp', 'desc').limit(this.msg_per_page))
    .valueChanges().subscribe((data) => {
      this.messages = data;
      this.sub_older_fired = true;
      this.sub_newer_fired = true;
      this.no_more_newer = true;
      this.no_more_older = false;
      this.current_first_msg_time = this.messages[0].timeStamp;
      this.current_last_msg_time = this.messages[this.messages.length - 1].timeStamp;
      this.messages.map(e => new Date(e.timeStamp).toString());
      this.messages.map((e) => e.message = e.message.split('-------------Reply above')[0]);
      this.displayName = this.authService.currentUserDisplayName;
      if (this.messages.length !== 0) {
        this.inbox_empty = false;
      } else {
        this.inbox_empty = true;
      }
    });
  }

  loadOlder() {
    if (this.sub_older_fired === false) {
        this.no_more_older = true;
    } else {
      this.sub.unsubscribe();
      this.sub = this.afs.collection<Message>('messages', ref => ref.where('rid', '==', this.authService.currentUserId)
      .orderBy('timeStamp', 'desc').startAfter(this.current_last_msg_time).limit(this.msg_per_page))
      .valueChanges().subscribe((data) => {
        if (data.length) {
          this.sub_older_fired = true;
          this.sub_newer_fired = true;
          this.no_more_newer = false;
          this.no_more_older = false;
          this.messages = data;
          this.first_msg_time = this.messages[0].timeStamp;
          this.last_msg_time = this.messages[this.messages.length - 1].timeStamp;
          if (this.current_last_msg_time === this.last_msg_time) {
            this.no_more_older = true;
          } else {
            this.no_more_older = false;
          }
          this.current_first_msg_time = this.first_msg_time;
          this.current_last_msg_time = this.last_msg_time;
          this.messages.map(e => new Date(e.timeStamp).toString());
          this.messages.map((e) => e.message = e.message.split('-------------Reply above')[0]);
          this.displayName = this.authService.currentUserDisplayName;
          if (this.messages.length !== 0) {
            this.inbox_empty = false;
          } else {
            this.inbox_empty = true;
          }
        } else {
          this.sub_older_fired = false;
        }
      });
    }
  }

  scrollHandler(e) {
    /* no good experience with this feature because it kees fireing after scroll stops!
    if (e === 'bottom') {
      // this.page.more();
      this.loadOlder();
    }
    if (e === 'top') {
      // this.page.more();
      this.loadNewer();
    }
    */
  }

  loadNewer() {
    if (this.sub_newer_fired === false) {
        this.no_more_newer = true;
    } else {
      this.sub.unsubscribe();
      this.sub = this.afs.collection<Message>('messages', ref => ref.where('rid', '==', this.authService.currentUserId)
      .orderBy('timeStamp', 'asc').startAfter(this.current_first_msg_time).limit(this.msg_per_page))
      .valueChanges().subscribe((data) => {
        if (data.length) {
          this.sub_older_fired = true;
          this.sub_newer_fired = true;
          this.no_more_older = false;
          this.no_more_newer = false;
          this.messages = data.reverse();
          this.first_msg_time = this.messages[0].timeStamp;
          this.last_msg_time = this.messages[this.messages.length - 1].timeStamp;
          if (this.current_first_msg_time === this.first_msg_time) {
            this.no_more_newer = true;
          } else {
            this.no_more_newer = false;
          }
          this.current_first_msg_time = this.first_msg_time;
          this.current_last_msg_time = this.last_msg_time;
          this.messages.map(e => new Date(e.timeStamp).toString());
          this.messages.map((e) => e.message = e.message.split('-------------Reply above')[0]);
          this.displayName = this.authService.currentUserDisplayName;
          if (this.messages.length !== 0) {
            this.inbox_empty = false;
          } else {
            this.inbox_empty = true;
          }
        } else {
          this.sub_newer_fired = false;
        }
      });
    }
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

  read(sid, mid) {
    if (sid && mid) {
      this.router.navigate(['/msg-read', sid, mid]);
    }
  }

  delete(mid) {
    if (mid) {
      this.afs.doc<Message>(`messages/${mid}`).delete();
    }
  }

  unArchive(msgid) {
    const sub = this.afs.doc<Message>(`messages/${msgid}`).valueChanges()
    .subscribe((data) => {
      const message = data;
      message.archived = false;
      this.afs.doc<Message>(`messages/${msgid}`).update(message);
      sub.unsubscribe();
    });
  }

  archive(msgid) {
    const sub = this.afs.doc<Message>(`messages/${msgid}`).valueChanges()
    .subscribe((data) => {
      const message = data;
      message.archived = true;
      this.afs.doc<Message>(`messages/${msgid}`).update(message);
      sub.unsubscribe();
    });
  }

  markUnRead(msgid) {
    const sub = this.afs.doc<Message>(`messages/${msgid}`).valueChanges()
    .subscribe((data) => {
      const message = data;
      message.opened = false;
      this.afs.doc<Message>(`messages/${msgid}`).update(message);
      sub.unsubscribe();
    });
  }

  markRead(msgid) {
    const sub = this.afs.doc<Message>(`messages/${msgid}`).valueChanges()
    .subscribe((data) => {
      const message = data;
      message.opened = true;
      this.afs.doc<Message>(`messages/${msgid}`).update(message);
      sub.unsubscribe();
    });
  }

  goBack() {
    this.location.back();
  }

}
