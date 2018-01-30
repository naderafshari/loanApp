import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';
import * as firebase from 'firebase';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { environment } from '../environments/environment';
import { MaterialModule } from './material/material.module';
import { AuthService } from './provider/auth.service';
import { UserService } from './provider/user.service';
import { FormService } from './provider/form.service';
import { LenderFormService } from './provider/lender-form.service';
import { AuthGuard } from './guard/auth.guard';
import { AdminGuard } from './guard/admin.guard';
import { LenderGuard } from './guard/lender.guard';
import { BorrowerGuard } from './guard/borrower.guard';
import { BorrowerAdminGuard } from './guard/borrower-admin.guard';
import { LenderAdminGuard } from './guard/lender-admin.guard';
import { router } from './app.routes';

import { AppComponent } from './app.component';
import { LoginComponent } from './component/login/login.component';
import { EmailLoginComponent } from './component/email-login/email-login.component';
import { SignupComponent } from './component/signup/signup.component';
import { ResetPasswordComponent } from './component/reset-password/reset-password.component';
import { UserProfileComponent } from './component/user-profile/user-profile.component';
import { UserManageComponent } from './component/user-manage/user-manage.component';
import { DialogComponent } from './component/dialog/dialog.component';
import { FormComponent } from './component/form/form.component';
import { FormManageComponent } from './component/form-manage/form-manage.component';
import { FormConfigComponent } from './component/form-config/form-config.component';
import { FormAssignComponent } from './component/form-assign/form-assign.component';
import { FormHistoryComponent } from './component/form-history/form-history.component';
import { FormReviewComponent } from './component/form-review/form-review.component';
import { NameFilterPipe } from './pipe/name-filter.pipe';
import { Autosize } from 'ng-autosize';
import { TextMaskModule } from 'angular2-text-mask';
import { UserFunctionComponent } from './component/user-function/user-function.component';
import { LenderPortalComponent } from './component/lender-portal/lender-portal.component';
import { BorrowerPortalComponent } from './component/borrower-portal/borrower-portal.component';
import { LenderFormConfigComponent } from './component/lender-form-config/lender-form-config.component';
import { LenderFormManageComponent } from './component/lender-form-manage/lender-form-manage.component';
import { LenderFormAssignComponent } from './component/lender-form-assign/lender-form-assign.component';
import { LenderFormHistoryComponent } from './component/lender-form-history/lender-form-history.component';
import { LenderProspectViewComponent } from './component/lender-prospect-view/lender-prospect-view.component';
import { EmailChangeComponent } from './component/email-change/email-change.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    EmailLoginComponent,
    SignupComponent,
    ResetPasswordComponent,
    UserProfileComponent,
    UserManageComponent,
    DialogComponent,
    FormComponent,
    FormManageComponent,
    FormConfigComponent,
    FormAssignComponent,
    FormHistoryComponent,
    FormReviewComponent,
    NameFilterPipe,
    Autosize,
    UserFunctionComponent,
    LenderPortalComponent,
    BorrowerPortalComponent,
    LenderFormConfigComponent,
    LenderFormManageComponent,
    LenderFormAssignComponent,
    LenderFormHistoryComponent,
    LenderProspectViewComponent,
    EmailChangeComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpModule,
    RouterModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,
    MaterialModule,
    TextMaskModule,
    RouterModule.forRoot(router),
    NgbModule.forRoot()
  ],
  entryComponents: [
    DialogComponent
  ],
  providers: [AuthService, UserService, FormService, LenderFormService,
    AuthGuard, AdminGuard, LenderGuard, BorrowerGuard, BorrowerAdminGuard, LenderAdminGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
