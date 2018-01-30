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

export const router: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'signup', component: SignupComponent },
    { path: 'email-login', component: EmailLoginComponent },
    { path: 'email-change', component: EmailChangeComponent, canActivate: [AuthGuard]  },
    { path: 'reset-password', component: ResetPasswordComponent },
    { path: 'user-function', component: UserFunctionComponent, canActivate: [AuthGuard] },
    { path: 'user-profile/:uid', component: UserProfileComponent, canActivate: [AuthGuard] },
    { path: 'user-manage', component: UserManageComponent, canActivate: [AdminGuard] },
    { path: 'borrower-portal', component: BorrowerPortalComponent, canActivate: [BorrowerAdminGuard] },
    { path: 'lender-portal', component: LenderPortalComponent, canActivate: [LenderAdminGuard] },
    { path: 'form/:uid/:fid', component: FormComponent, canActivate: [AuthGuard] },
    { path: 'form-manage/:uid', component: FormManageComponent, canActivate: [LenderAdminGuard] },
    { path: 'form-config/:id', component: FormConfigComponent, canActivate: [LenderAdminGuard] },
    { path: 'form-assign/:uid', component: FormAssignComponent, canActivate: [LenderAdminGuard] },
    { path: 'form-history/:uid', component: FormHistoryComponent, canActivate: [LenderAdminGuard] },
    { path: 'form-review/:uid/:tid', component: FormReviewComponent, canActivate: [LenderAdminGuard] },
    { path: 'lender-form-manage/:uid', component: LenderFormManageComponent, canActivate: [LenderAdminGuard] },
    { path: 'lender-form-config/:id', component: LenderFormConfigComponent, canActivate: [LenderAdminGuard] },
    { path: 'lender-form-assign/:uid', component: LenderFormAssignComponent, canActivate: [LenderAdminGuard] },
    { path: 'lender-form-history/:uid', component: LenderFormHistoryComponent, canActivate: [LenderAdminGuard] },
    { path: 'lender-prospect-view', component: LenderProspectViewComponent, canActivate: [LenderAdminGuard] }
];

export const routes: ModuleWithProviders = RouterModule.forRoot(router);
