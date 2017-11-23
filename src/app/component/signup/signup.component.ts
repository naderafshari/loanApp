import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../provider/auth.service';
import { Router } from '@angular/router';   
import * as firebase from 'firebase';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  error: any;
  user: any;
  
  constructor(public authService: AuthService, private router:Router) { 
    //this.user = this.authService.user;
  }
  
  signup(formData){
    if(formData.valid) {
      if (formData.value.password == formData.value.password2) {
        this.authService.signup(formData.value.email, formData.value.password).then(
          () => {
            //alert('User logged in successfully !');
            this.router.navigateByUrl('/user-profile');
            //this.user = this.authService.user;
          },
          error => alert(error)
        );
      }
      else
      {
        alert("passwords do not match");
      }
    }
  }

  ngOnInit() {
  }
}
