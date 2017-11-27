import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../provider/auth.service';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (!this.authService.authenticated){
        return false;
    }  
    return true;
  } 
}
