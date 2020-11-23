import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, FormGroupDirective, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { AngularFirestore } from '@angular/fire/firestore';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}



@Component({
  selector: 'app-chatroom',
  templateUrl: './chatroom.component.html',
  styleUrls: ['./chatroom.component.css']
})
export class ChatroomComponent implements OnInit {

  @ViewChild('chatcontent') chatcontent: ElementRef;
  scrolltop: number = null;

  chatForm: FormGroup;
  nickname = '';
  roomname = '';
  message = '';
  users ;
  chats;
  matcher = new MyErrorStateMatcher();
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private afs: AngularFirestore
              ) {

     this.nickname = localStorage.getItem('nickname');
               }

  ngOnInit(): void {
   this.roomname = this.route.snapshot.paramMap.get('roomid');
   // tslint:disable-next-line: max-line-length
   this.users = this.afs.collection('roomusers' ,
    ref => ref
    .where('roomname', '==', this.roomname)
    .where('status', '==', 'online'))
    .valueChanges();

   this.afs.collection('chats', ref =>
   ref.orderBy('date', 'asc'))
   .valueChanges()
   .subscribe(messages => {
     this.chats = messages.filter((x: any ) => x.roomname === this.roomname);
     return this.chats;
   });
   this.chatForm = this.formBuilder.group({
      message : [null, Validators.required]
    });
  }

  onFormSubmit(form: any) {
    const chat = form;
    chat.roomname = this.route.snapshot.paramMap.get('roomid');
    chat.nickname = this.nickname;
    chat.type = 'message';
    chat.date = new Date().toTimeString();
    this.afs.collection('chats').add(chat);
    this.chatForm = this.formBuilder.group({
    message : [null, Validators.required]
    });
  }

   exitChat() {
    const chat = { roomname: '', nickname: '', message: '', date: null, type: '' , status: '' };
    chat.roomname = this.route.snapshot.paramMap.get('roomid');
    chat.nickname = this.nickname;
    chat.message = `${this.nickname} leave the room`;
    chat.date = new Date().toTimeString();
    chat.type = 'exit';
    chat.status = 'offline';
    this.afs.collection('chats').add(chat);
    this.afs.collection('roomusers',
     ref => ref
     .where('roomname', '==', chat.roomname)
     .where('nickname', '==', this.nickname))
     .get()
     .subscribe(item=>{
      item.forEach(e=>{
        const Id = e.id;
        console.log(Id);
        this.afs.collection('roomusers').doc(Id).update(chat);
      })
    })

    this.router.navigate(['/roomlist']);
  }

}
