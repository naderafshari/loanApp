import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { AuthService } from '../../provider/auth.service';
import { Router } from '@angular/router';
import * as firebase from 'firebase';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  constructor(public authService: AuthService, private afs: AngularFirestore, private router: Router) {
  }

  signup(formData) {
    if (formData.valid) {
      if (formData.value.password === formData.value.password2) {
        this.authService.signup(formData.value.email, formData.value.password, formData.value.displayName);
      } else {
        alert('passwords do not match');
      }
    }
  }

  ngOnInit() {
  }
}
