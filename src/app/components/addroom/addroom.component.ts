import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Router } from '@angular/router';


export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-addroom',
  templateUrl: './addroom.component.html',
  styleUrls: ['./addroom.component.css']
})
export class AddroomComponent implements OnInit {


  roomForm: FormGroup;
  nickname = '';
  roomname = '';
  afsCol: AngularFirestoreCollection;
  afsDoc: AngularFirestoreDocument;
  matcher = new MyErrorStateMatcher();
  hasrooms = [];
  hasname = [];


  constructor(
       private afs: AngularFirestore,
       private router: Router,
       private fb: FormBuilder,
       private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
   this.afs.collection('rooms').get().subscribe(data => {
        data.forEach(e => {
          const item = e.data();
          this.hasrooms.push(item);
        });
        this.hasrooms.map(item => {
          this.hasname.push(item.roomname);
        });
    });
   this.roomForm = this.fb.group({
      roomname: [null, Validators.required]
    });
  }

  onFormSubmit(form: any){
  this.afsCol = this.afs.collection('rooms');
  if (this.hasname.includes(form.roomname)){
  this.router.navigate(['/roomlist']);
  }else{
  this.afsCol.add(form);
  this.router.navigate(['/roomlist']);
  }
  }

}
