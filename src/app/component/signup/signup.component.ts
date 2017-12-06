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
  error: any;
  user: any;
  
  constructor(public authService: AuthService, private afs: AngularFirestore, private router:Router) { 
    //this.user = this.authService.user;
  }
  
  signup(formData){
    if(formData.valid) {
      if (formData.value.password == formData.value.password2) {
        this.authService.signup(formData.value.email, formData.value.password, formData.value.displayName);
/*        .then( () => {
            //create a user document in firestore with only some info
            this.afs.collection('users').doc(this.authService.currentUserId).set({ 
              'displayName': formData.value.displayName, 
              'email': this.authService.currentUserEmail
            });

            this.router.navigateByUrl('/user-profile');
          },
          error => alert(error)        
      );
*/
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
