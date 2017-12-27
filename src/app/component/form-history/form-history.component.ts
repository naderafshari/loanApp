import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { AuthService } from '../../provider/auth.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/forkJoin';
import { UserInfo } from '../../model/user-info';
import { Form, FormInfo } from '../../model/form';
import { Subscription } from 'rxjs/Subscription';
import {MatTableDataSource} from '@angular/material';

@Component({
  selector: 'app-form-history',
  templateUrl: './form-history.component.html',
  styleUrls: ['./form-history.component.css']
})

export class FormHistoryComponent implements OnInit {
  form: FormInfo[];
  displayedColumns = ['formId', 'formName', 'assigned', 'startTime', 'updateTime'];
  dataSource = new MatTableDataSource<FormInfo>(this.form);

  constructor() { }

  ngOnInit() {
  }

}
