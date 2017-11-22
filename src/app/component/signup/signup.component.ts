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
  email: string;
  password: string;
  password2: string;
  
  constructor(public authService: AuthService, private router:Router) { 
  }
  
  signup(){
    if (this.password == this.password2) {
      this.authService.signup(this.email, this.password).then(
        () => {
          //alert('User logged in successfully !');
          this.router.navigateByUrl('/user-profile');
        },
        err => alert(err)
      );
    }
    else
    {
      alert("passwords do not match");
    }
}

  ngOnInit() {
  }

}
