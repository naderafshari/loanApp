import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../provider/auth.service';
import { Router } from '@angular/router';   

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
})
export class UserProfileComponent implements OnInit {

  constructor(public authService: AuthService, private router:Router) { 
    console.log(authService.user);
  }

  ngOnInit() {
  }
  
  logout() {
    this.authService.logout()
    .then(
      () => {
              //alert('User logged out successfully!');
              this.router.navigateByUrl('/email-login');
      },
//    this.email = this.password = '',
      err => alert(err)
    );
  }
}
