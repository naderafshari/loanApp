import { Component, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { AuthService } from '../../provider/auth.service';
import { FormService } from '../../provider/form.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/forkJoin';
import { UserInfo } from '../../model/user-info';
import { Form, FormInfo } from '../../model/form';
import { Subscription } from 'rxjs/Subscription';
import { MatTableDataSource, MatSort } from '@angular/material';
import { MatPaginator } from '@angular/material';

@Component({
  selector: 'app-form-history',
  templateUrl: './form-history.component.html',
  styleUrls: ['./form-history.component.css']
})

export class FormHistoryComponent {
  uid: string;
  formData: Form;
  userDoc: Observable<{}>;
  user: any;
  userInfo: UserInfo;
  sub: Subscription;
  formsInfo: FormInfo[] = [];
  displayedColumns = ['formId', 'formName', 'startTime', 'updateTime'];
  dataSource: any;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private afs: AngularFirestore,
              private router: Router,
              private route: ActivatedRoute,
              public fs: FormService) {
    this.route.params.subscribe(params => {
      this.uid = params['uid'] || 0;
      if (this.uid) {
        this.formsInfo = [];
        this.userDoc = this.afs.doc(`users/${this.uid}`).valueChanges();
        this.userDoc.subscribe((data: UserInfo) => {
          this.userInfo = data;
          if (this.userInfo) {
            this.sub = this.afs.doc(`users/${this.uid}`).collection<Form>('forms').valueChanges()
            .subscribe((forms: Form[]) => {
              forms.forEach((form: Form) => {
                const formInfo = {
                  'formId': form.formId,
                  'formName': form.formName,
                  'startTime': form.startTime,
                  'updateTime': form.updateTime
                };
                this.formsInfo.push(formInfo);
              });
              this.dataSource = new MatTableDataSource<FormInfo>(this.formsInfo);
              this.dataSource.paginator = this.paginator;
              this.dataSource.sort = this.sort;
              this.sub.unsubscribe();
            });
          }
        });
      }
    });
  }

}
