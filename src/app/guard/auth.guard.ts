import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../provider/auth.service';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';
import * as _ from 'lodash';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService,  private router: Router) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | boolean {
      return this.authService.currentUser
            .take(1)
            .map(user => !!user)
            .do(loggedIn => {
              if (!loggedIn) {
                console.log('access denied');
                this.router.navigate(['/login']);
              }
          });
  }
}
