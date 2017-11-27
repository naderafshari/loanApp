import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AngularFireModule } from 'angularfire2';
import { environment } from '../environments/environment';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from "@angular/router";
import * as firebase from 'firebase';

import { AuthService } from './provider/auth.service';
import { AuthGuard } from './guard/auth.guard';
import { routes, router } from './app.routes';

import { AppComponent } from './app.component';
import { LoginComponent } from './component/login/login.component';
import { EmailLoginComponent } from './component/email-login/email-login.component';
import { SignupComponent } from './component/signup/signup.component';
import { ResetPasswordComponent } from './component/reset-password/reset-password.component';
import { UserProfileComponent } from './component/user-profile/user-profile.component';
import { UserManageComponent } from './component/user-manage/user-manage.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    EmailLoginComponent,
    SignupComponent,
    ResetPasswordComponent,
    UserProfileComponent,
    UserManageComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,
    RouterModule.forRoot(router)
  ],
  providers: [AuthService, AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
