import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { AuthService } from '../../provider/auth.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/forkJoin';
import { Form } from '../../model/form';
import { FormService } from '../../provider/form.service'

@Component({
  selector: 'app-form-config',
  templateUrl: './form-config.component.html',
  styleUrls: ['./form-config.component.css']
})
export class FormConfigComponent implements OnInit {

  userDoc: any;
  forms: Form[];
  form: Observable<Form>;
  id: string;
  formData: Form;
  formRef: AngularFirestoreDocument<Form>;

  constructor(private afs: AngularFirestore,
    public fs: FormService,
    private router: Router,
    private route: ActivatedRoute) {

    this.route.params.subscribe(params => {
      this.id = params['id'] || 0;
          if (this.id) {
            this.formRef = this.afs.doc<Form>(`forms/${this.id}`);
            this.form = this.formRef.valueChanges();
          }
    });
    this.form.subscribe((data) => console.log(data));
  }

  ngOnInit() {
  }

}
