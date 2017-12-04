import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../provider/auth.service';
import { UserAuthInfo } from '../provider/user-info';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';
import * as _ from 'lodash'

@Injectable()
export class AdminGuard implements CanActivate {

  constructor(private authService: AuthService,  private router: Router) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | boolean {
    return this.authService.user
      .take(1)
      .map(user => _.isEqual(_.get(user, 'role'), 'admin'))
      .do(authorized => {
      if (!authorized) {
        this.authService.logout()
        .then( () =>  {
        console.log('route prevented!')
        alert('Access denied! Insufficient priviliges.');
        // this.router.navigate(['/']);
        })
      }
      //else{
      //  console.log('route allowed!')        
      //}
    })  
    // const allowed = ['admin']
    // let result: boolean;
  
    //   this.authService.user.subscribe( (data) => {
    //     if(data){
    //       console.log("CanActivate 3: Roles of logged in user: ", data.roles);
    //       this.userRoles = _.keys(_.get(data, 'roles'))
    //       console.log("CanActivate 4: Roles of logged in user: ", this.userRoles);
    //       result = this.matchingRole(allowed)
    //       if(result)
    //       {
    //         console.log("the user is an admin");
    //       }
    //       else {
    //       console.log("the user is NOT an admin");
    //       }
    //     }
    //   });
    //   return result;
    }

  // private matchingRole(allowedRoles): boolean {
  //   let result: boolean;

  //   console.log("CanActivate 1: Roles of logged in user: ", this.userRoles );
  //   console.log("CanActivate 2: intersection: ", _.intersection(allowedRoles, this.userRoles));
  //   return !_.isEmpty(_.intersection(allowedRoles, this.userRoles));
    // this.authService.user.subscribe( (data) => {
    //   if(data){
    //     console.log("CanActivate 3: Roles of logged in user: ", data.roles);
    //     this.userRoles = _.keys(_.get(data, 'roles'))
    //     console.log("CanActivate 4: Roles of logged in user: ", this.userRoles);
    //     console.log("CanActivate 5: allowed user: ", allowedRoles);
    //     result = !_.isEmpty(_.intersection(allowedRoles, this.userRoles));
    //     console.log("CanActivate 6: intersection: ", _.intersection(allowedRoles, this.userRoles));
    //   }
    // });
    // return result
//  }
}
