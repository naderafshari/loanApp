import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { NgForm, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DialogComponent } from '../dialog/dialog.component';
import { Location } from '@angular/common';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { AuthService } from '../../provider/auth.service';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/forkJoin';
import { UserInfo } from '../../model/user-info';
import { Message } from '../../model/message';

@Component({
  selector: 'app-msg-read',
  templateUrl: './msg-read.component.html',
  styleUrls: ['./msg-read.component.css']
})
export class MsgReadComponent implements OnInit, OnDestroy {
  sub0: Subscription;
  sub1: Subscription;
  uid: string;
  msgid: string;
  rx_user: UserInfo;
  tx_user: UserInfo;
  private base64textString = '';
  @ViewChild('imageFile')
  imageFileVariable: any;

  sender_name: string;					/* @string [sender_name]	*/
  sender_id: string;					  /* @string [sender_name]	*/
  receiver_name: string;				/* @string [receiver's sender_name] */
  receiver_id: string;			  	/* @string [receiver's id] */
  message = null;					      /* @string [the main message] */
  conversation_subject = null;  /* conversation subject */
  error_msg = false;				    /* @boobean [to show the error message] */
  success_msg = false;			    /* @boobean [to show the success message] */
  receiver_valid = false;		    /* @boobean [to check whether the correect receiver has inserted] */
  user_empty = false;			      /* @boobean [to check whether there is any receiver or not] */
  users: any[] = [];				  	/* @receiver [list of receiver object] */
  conversation_data: Message;
  stateCtrl: FormControl;
  filteredUsers: Observable<any[]>;
  original_message: Message;

  constructor(private afs: AngularFirestore,
    public authService: AuthService, public dialog: MatDialog,
    private router: Router, private location: Location,
    private route: ActivatedRoute) {

    this.route.params.subscribe(params => {
      this.uid = params['uid'] || 0;
      this.msgid = params['mid'] || 0;
      if (this.uid) {
        this.sub0 = this.afs.doc<UserInfo>(`users/${this.uid}`)
        .valueChanges().subscribe((data) => {
          if (data) {
            this.rx_user = data;
            this.receiver_name = this.rx_user.displayName;
            this.receiver_id = this.rx_user.uid;
            this.receiver_valid = true;
            this.user_empty = false;
          } else {
            this.user_empty = true;
          }
        });
        this.sub1 = this.afs.doc<UserInfo>(`users/${this.authService.currentUserId}`)
        .valueChanges().subscribe((data) => {
          this.tx_user = data;
          this.sender_name = this.tx_user.displayName;
          this.sender_id = this.tx_user.uid;
        });
      }
      if (this.msgid) {
        this.afs.doc<Message>(`messages/${this.msgid}`)
        .valueChanges().take(1).subscribe((data) => {
          this.original_message = data;
          this.original_message.message = this.original_message.message.split('-------------Reply above')[0];
          this.original_message.opened = true;
          this.afs.doc<Message>(`messages/${this.msgid}`).update(this.original_message);
        });
      }
    });
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    if (this.sub0) {
      this.sub0.unsubscribe();
    }
    if (this.sub1) {
      this.sub1.unsubscribe();
    }
  }

  filterUsers(sender_name: string) {
    return this.users.filter(user =>
      user.sender_name.toLowerCase().indexOf(sender_name.toLowerCase()) === 0);
  }

  get_user() {
    this.stateCtrl = new FormControl();
    return this.rx_user.displayName;
  }

  handleImageFileSelect(evt)  {
    const files = evt.target.files;
    const file = files[0];
    if (files && file) {
      const reader = new FileReader();
      reader.onload = this._handleImageReaderLoaded.bind(this);
      reader.readAsBinaryString(file);
    }
  }
  _handleImageReaderLoaded(readerEvt) {
    const binaryString = readerEvt.target.result;
    this.base64textString = btoa(binaryString);
  }

  reply(sid, mid) {
    if (sid && mid) {
      this.router.navigate(['/msg-compose', sid, mid]);
    }
  }

  openDeleteDialog(mid): void {
    if (mid) {
      const dialogRef = this.dialog.open(DialogComponent, {
        width: '250px',
        data: 'You are about to Delete a Message. Are you sure?'
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result === 'Confirm') {
          this.delete(mid);
        }
      });
    } else {
      alert('No Delete privilages! Please contact the Administrator');
    }
  }

  delete(mid) {
    if (mid) {
      this.afs.doc<Message>(`messages/${mid}`).delete();
      this.location.back();
    }
  }

  goBack() {
    this.location.back();
    // this.router.navigateByUrl('/lender-portal');
  }

}
