import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { NgForm, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
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
  selector: 'app-msg-compose',
  templateUrl: './msg-compose.component.html',
  styleUrls: ['./msg-compose.component.css']
})
export class MsgComposeComponent implements OnInit, OnDestroy {
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
    public authService: AuthService,
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
          if (!this.original_message.subject.startsWith('RE:')) {
            this.conversation_subject = 'RE: ' + this.original_message.subject;
          } else {
            this.conversation_subject = this.original_message.subject;
          }
          this.message = '\n\n' + '-------------Reply above this line-------------\n'
          + `Last Message from: ${this.original_message.sName}\n
          Received on: ${this.original_message.timeStamp}\n\n`
          + this.original_message.message;
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

  get_all_users() {
    this.stateCtrl = new FormControl();
    this.filteredUsers = this.stateCtrl.valueChanges
    .startWith(null)
    .map((user) => {
      if (user) {
        this.receiver_name = user;
        this.receiver_valid = true;
        return this.filterUsers(user);
      } else {
        this.receiver_valid = false;
        return this.users.slice();
      }
    });
  }

  get_user() {
    this.stateCtrl = new FormControl();
    return this.rx_user.displayName;
  }

  send_conversation(form: NgForm) {
    const conversation_data = {
      msgid: this.afs.createId(),
      sid: this.sender_id,
      rid: this.receiver_id,
      sName: this.sender_name,
      rName: this.receiver_name,
      subject: form.value.conversation_subject,
      message: form.value.message,
      timeStamp: new Date().toString()
    };
    if (this.sender_name === this.receiver_name) {
      this.receiver_valid = false;
      this.error_msg = true;
    } else {
      const ref = this.afs.collection('messages').doc(conversation_data.msgid);
      ref.set(conversation_data)  // sets the contents of the doc using the id
      .then(() => {  // fetch the doc again and show its data
        this.message = '';
        this.conversation_subject = '';
        this.base64textString = '';
        // this.imageFileVariable.nativeElement.value = '';
        this.receiver_valid = false;
        this.success_msg = true;
        this.error_msg = false;
//        this.get_all_users();
      })
      .catch( error => {
        console.log(error);
        this.receiver_valid = false;
        this.error_msg = true;
      });
    }

  }
  close_success_msg() {
    this.success_msg = false;
    // this.router.navigateByUrl('/msg-inbox');
    this.goBack();
  }

  close_error_msg() {
    this.error_msg = false;
    // this.router.navigateByUrl('/msg-inbox');
    this.goBack();
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

  goBack() {
    this.location.back();
  }

}
