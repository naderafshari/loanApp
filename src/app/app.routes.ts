import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { AuthGuard } from './guard/auth.guard';
import { AdminGuard } from './guard/admin.guard';
import { LenderGuard } from './guard/lender.guard';
import { BorrowerGuard } from './guard/borrower.guard';

import { LoginComponent } from './component/login/login.component';
import { EmailLoginComponent } from './component/email-login/email-login.component';
import { SignupComponent } from './component/signup/signup.component';
import { ResetPasswordComponent } from './component/reset-password/reset-password.component';
import { UserProfileComponent } from './component/user-profile/user-profile.component';
import { UserManageComponent } from './component/user-manage/user-manage.component';
import { UserFunctionComponent } from './component/user-function/user-function.component';
import { FormComponent } from './component/form/form.component';
import { FormManageComponent } from './component/form-manage/form-manage.component';
import { FormConfigComponent } from './component/form-config/form-config.component';
import { FormAssignComponent } from './component/form-assign/form-assign.component';
import { FormHistoryComponent } from './component/form-history/form-history.component';
import { FormReviewComponent } from './component/form-review/form-review.component';

export const router: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'signup', component: SignupComponent },
    { path: 'email-login', component: EmailLoginComponent },
    { path: 'reset-password', component: ResetPasswordComponent },
    { path: 'user-profile/:uid', component: UserProfileComponent, canActivate: [AuthGuard] },
    { path: 'user-manage', component: UserManageComponent, canActivate: [AuthGuard && BorrowerGuard] },
    { path: 'user-function', component: UserFunctionComponent, canActivate: [AuthGuard] },
    { path: 'form/:uid/:fid', component: FormComponent, canActivate: [AuthGuard] },
    { path: 'form-manage/:uid', component: FormManageComponent, canActivate: [AdminGuard] },
    { path: 'form-config/:id', component: FormConfigComponent, canActivate: [AdminGuard] },
    { path: 'form-assign/:uid', component: FormAssignComponent, canActivate: [AdminGuard] },
    { path: 'form-history/:uid', component: FormHistoryComponent, canActivate: [AdminGuard] },
    { path: 'form-review/:uid/:tid', component: FormReviewComponent, canActivate: [AdminGuard] }
];

export const routes: ModuleWithProviders = RouterModule.forRoot(router);
