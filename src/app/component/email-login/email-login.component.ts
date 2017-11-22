import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../provider/auth.service';
import { Router } from '@angular/router';   
import * as firebase from 'firebase';

@Component({
  selector: 'app-email-login',
  templateUrl: './email-login.component.html',
  styleUrls: ['./email-login.component.css']
})
export class EmailLoginComponent implements OnInit {
  email: string;
  password: string;

  constructor(public authService: AuthService, private router:Router) { 
  }
  
  login() {
    this.authService.login(this.email, this.password).then(
        () => {
            //alert('User logged in successfully !');
            this.router.navigateByUrl('/user-profile');
        },
  //    this.email = this.password = '',
        err => alert(err)
      );
  }

  goPasswordReset(){
    this.router.navigateByUrl('/reset-password');    
  }

  ngOnInit() {
  }

}
