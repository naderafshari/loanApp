import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { AuthService } from '../../provider/auth.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/forkJoin';
import { Form } from '../../model/form';
import { FormService } from '../../provider/form.service';

@Component({
  selector: 'app-form-config',
  templateUrl: './form-config.component.html',
  styleUrls: ['./form-config.component.css']
})
export class FormConfigComponent implements OnInit {
  form: Form;
  id: string;

  constructor(private afs: AngularFirestore,
    public fs: FormService,
    private router: Router,
    private route: ActivatedRoute) {

    this.route.params.subscribe(params => {
      this.id = params['id'] || 0;
      if (this.id) {
        this.fs.getForm(this.id).subscribe((data) => this.form = data);
      }
    });
  }

  updateForm() {
    if (this.form) {
      this.afs.collection('forms').doc(this.id).update(this.form);
    } else {
      alert('Cannot Update, user not logged in!');
    }
    this.router.navigateByUrl('/form-manage');
  }

  ngOnInit() {
  }

}
