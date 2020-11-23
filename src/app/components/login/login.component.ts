import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroupDirective, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  UsersCol: AngularFirestoreCollection;
  UsersDoc: AngularFirestoreDocument;
  nickname ;
  matcher = new MyErrorStateMatcher();
  nicknames = [];
  hasname = [];
  sameName = false;
  user = [];

  constructor(
    private afs: AngularFirestore,
    private router: Router,
    private fb: FormBuilder
     ) { }

  ngOnInit() {
    if (localStorage.getItem('nickname')){
      this.router.navigate(['/roomlist']);
    }
    this.afs.collection('users').get().subscribe(data => {
        data.forEach(e => {
          const item = e.data();
          this.nicknames.push(item);
        });
        this.nicknames.map(item => {
        this.hasname.push(item.nickname);
      });
    });


    this.loginForm = this.fb.group({
      nickname: [null, Validators.required]
    });
  }

  onFormSubmit(form: any){
    const login = form;
    console.log('輸入的nickname: ' + login.nickname);
    this.UsersCol = this.afs.collection('users');
    if (this.hasname.includes(login.nickname)){
      localStorage.setItem('nickname',login.nickname);
      this.router.navigate(['roomlist']);
    }else{
      localStorage.setItem('nickname',login.nickname);
      this.router.navigate(['roomlist']);
      this.UsersCol.add(login);
    }
 }

}
