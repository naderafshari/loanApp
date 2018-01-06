import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../provider/auth.service';
import { Router } from '@angular/router';
import * as firebase from 'firebase';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  // error: any;

  constructor( public authService: AuthService, private router: Router) {
  }

  googleLogin() {
    this.authService.googleLogin();
    /*.then(
      () => {
        this.router.navigateByUrl('/user-profile');
      }
    ),
    error => alert(error)*/
  }

  facebookLogin() {
    this.authService.facebookLogin();
    /*.then(
      () => {
        this.router.navigateByUrl('/user-profile');
      }
    ),
    error => alert(error)*/
  }

  ngOnInit() {
  }

}
