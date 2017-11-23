import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../provider/auth.service';
import { Router } from '@angular/router';   
import { subscribeOn } from 'rxjs/operator/subscribeOn';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
})
export class UserProfileComponent implements OnInit {

  constructor(public authService: AuthService, private router:Router) { 
    let user = authService.user.subscribe(
      //google login would not have the user updated when redirected to this page
      //when subscribing to the user is updated when observer is fired 
      //() => console.log("observer fired")
    );
  }

  ngOnInit() {
  }
  
  logout() {
    this.authService.logout()
    .then(
      () => {
              //alert('User logged out successfully!');
              this.router.navigateByUrl('/login');
      },
//    this.email = this.password = '',
      err => alert(err)
    );
  }
}
