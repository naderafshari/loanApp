import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../provider/auth.service';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';
import * as _ from 'lodash';

@Injectable()
export class AdminGuard implements CanActivate {

  constructor(private authService: AuthService,  private router: Router) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | boolean {
    return this.authService.user
      .take(1)
      .map(user => (_.isEqual(_.get(user, 'role'), 'admin') || _.isEqual(_.get(user, 'role'), 'super')))
      .do(authorized => {
        if (!authorized) {
          this.authService.logout()
          .then( () =>  {
          console.log('route prevented!');
          alert('Access denied! Insufficient priviliges.');
          // this.router.navigate(['/']);
          });
        }
        //else{
        //  console.log('route allowed!')
        //}
      });
    }
}
