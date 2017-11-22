import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../provider/auth.service';
import { Router } from '@angular/router';   
import * as firebase from 'firebase';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  email: string;
  
  constructor(public authService: AuthService, private router:Router) { }
  
  resetPassword(){
    this.authService.resetPassword(this.email)
    .then(
      () => {
        console.log("email sent");
        this.router.navigateByUrl('/email-login');
      }
    ),
    err => alert(err)
  }

  ngOnInit() {
  }

}
