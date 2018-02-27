import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { AuthGuard } from './guard/auth.guard';
import { AdminGuard } from './guard/admin.guard';
import { LenderGuard } from './guard/lender.guard';
import { BorrowerGuard } from './guard/borrower.guard';
import { BorrowerAdminGuard } from './guard/borrower-admin.guard';
import { LenderAdminGuard } from './guard/lender-admin.guard';

import { LoginComponent } from './component/login/login.component';
import { EmailLoginComponent } from './component/email-login/email-login.component';
import { EmailChangeComponent } from './component/email-change/email-change.component';
import { SignupComponent } from './component/signup/signup.component';
import { ResetPasswordComponent } from './component/reset-password/reset-password.component';
import { UserProfileComponent } from './component/user-profile/user-profile.component';
import { UserManageComponent } from './component/user-manage/user-manage.component';
import { UserFunctionComponent } from './component/user-function/user-function.component';
import { BorrowerPortalComponent } from './component/borrower-portal/borrower-portal.component';
import { LenderPortalComponent } from './component/lender-portal/lender-portal.component';
import { FormComponent } from './component/form/form.component';
import { FormManageComponent } from './component/form-manage/form-manage.component';
import { FormConfigComponent } from './component/form-config/form-config.component';
import { FormAssignComponent } from './component/form-assign/form-assign.component';
import { FormHistoryComponent } from './component/form-history/form-history.component';
import { FormReviewComponent } from './component/form-review/form-review.component';
import { LenderFormManageComponent } from './component/lender-form-manage/lender-form-manage.component';
import { LenderFormConfigComponent } from './component/lender-form-config/lender-form-config.component';
import { LenderFormAssignComponent } from './component/lender-form-assign/lender-form-assign.component';
import { LenderFormHistoryComponent } from './component/lender-form-history/lender-form-history.component';
import { LenderProspectViewComponent } from './component/lender-prospect-view/lender-prospect-view.component';
import { LenderOwnedUsersComponent } from './component/lender-owned-users/lender-owned-users.component';
import { LenderCartComponent } from './component/lender-cart/lender-cart.component';
import { MsgInboxComponent } from './component/msg-inbox/msg-inbox.component';
import { MsgComposeComponent } from './component/msg-compose/msg-compose.component';
import { MsgReadComponent } from './component/msg-read/msg-read.component';
import { UserAgreementComponent } from './component/user-agreement/user-agreement.component';

export const router: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'signup', component: SignupComponent },
    { path: 'email-login', component: EmailLoginComponent },
    { path: 'email-change', component: EmailChangeComponent, canActivate: [AuthGuard]  },
    { path: 'reset-password', component: ResetPasswordComponent },
    { path: 'user-agreement', component: UserAgreementComponent, canActivate: [AuthGuard] },
    { path: 'user-function', component: UserFunctionComponent, canActivate: [AuthGuard] },
    { path: 'user-profile/:uid', component: UserProfileComponent, canActivate: [AuthGuard] },
    { path: 'user-manage', component: UserManageComponent, canActivate: [AdminGuard] },
    { path: 'borrower-portal', component: BorrowerPortalComponent, canActivate: [BorrowerAdminGuard] },
    { path: 'form/:uid/:fid', component: FormComponent, canActivate: [AuthGuard] },
    { path: 'form-manage/:uid', component: FormManageComponent, canActivate: [LenderAdminGuard] },
    { path: 'form-config/:id', component: FormConfigComponent, canActivate: [LenderAdminGuard] },
    { path: 'form-assign/:uid', component: FormAssignComponent, canActivate: [LenderAdminGuard] },
    { path: 'form-history/:uid', component: FormHistoryComponent, canActivate: [LenderAdminGuard] },
    { path: 'form-review/:uid/:tid', component: FormReviewComponent, canActivate: [LenderAdminGuard] },
    { path: 'lender-form-manage/:uid', component: LenderFormManageComponent, canActivate: [LenderAdminGuard] },
    { path: 'lender-form-config/:uid/:fid', component: LenderFormConfigComponent, canActivate: [LenderAdminGuard] },
    { path: 'lender-form-assign/:uid', component: LenderFormAssignComponent, canActivate: [LenderAdminGuard] },
    { path: 'lender-form-history/:uid', component: LenderFormHistoryComponent, canActivate: [LenderAdminGuard] },
    { path: 'lender-portal', component: LenderPortalComponent, canActivate: [LenderAdminGuard] },
    { path: 'lender-prospect-view', component: LenderProspectViewComponent, canActivate: [LenderAdminGuard] },
    { path: 'lender-owned-users', component: LenderOwnedUsersComponent, canActivate: [LenderAdminGuard] },
    { path: 'lender-cart/:uid', component: LenderCartComponent, canActivate: [LenderAdminGuard] },
    { path: 'msg-compose/:uid/:mid', component: MsgComposeComponent, canActivate: [AuthGuard] },
    { path: 'msg-inbox', component: MsgInboxComponent, canActivate: [AuthGuard] },
    { path: 'msg-read/:uid/:mid', component: MsgReadComponent, canActivate: [AuthGuard] },
];

export const routes: ModuleWithProviders = RouterModule.forRoot(router);
