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

  constructor(public authService: AuthService, private router: Router) { }

  resetPassword(formData) {
    if (formData.valid) {
        this.authService.resetPassword(formData.value.email)
        .then(
          () => {
            alert('email sent');
            this.router.navigateByUrl('/email-login');
          }
        )
        .catch((err) => alert(err));
      }
  }

  ngOnInit() {
  }

}
