import { AngularFirestore } from '@angular/fire/firestore';
import { Component, OnInit } from '@angular/core';
import {  Router } from '@angular/router';

export const snapshotToArray = (snapshot: any) => {
  const returnArr = [];

  snapshot.forEach((childSnapshot: any) => {
    const item = childSnapshot.val();
    item.key = childSnapshot.key;
    return returnArr.push(item);
  });
  return returnArr;
};

@Component({
  selector: 'app-roomlist',
  templateUrl: './roomlist.component.html',
  styleUrls: ['./roomlist.component.css']
})
export class RoomlistComponent implements OnInit {

  nickname = '';
  displayedColumns: string[] = ['roomname'];
  rooms;
  isLoadingResults = false;

  constructor(
     private router: Router,
     private afs: AngularFirestore
  ) {
     this.nickname = localStorage.getItem('nickname');

     this.isLoadingResults = false;
   }

  ngOnInit(): void {
   this.rooms = this.afs.collection('rooms').valueChanges();
  }


  enterChatRoom(roomname: string){
    const chat = {roomname: '', nickname: '', message: '', date: null, type: ''};

    chat.roomname = roomname;
    chat.nickname = this.nickname;
    chat.message = `${this.nickname} enter the room`;
    chat.date = new Date().toTimeString();
    chat.type = 'join';

    const user = {roomname: '', nickname: '', status: ''};
    user.roomname = roomname;
    user.nickname = this.nickname;
    user.status = 'online';

    this.afs.collection('chats').add(chat);
    // , ref => ref
    // .where('roomname', '==', roomname)
    //  ).get().subscribe(item => {
    //   if (item.empty){
    //     this.afs.collection('chats').add(chat);
    //     this.router.navigate(['chatroom/', roomname]);
    //   }else{
    //     this.router.navigate(['chatroom/', roomname]);
    //   }
    // });

    // tslint:disable-next-line: max-line-length
    this.afs.collection('roomusers',
    ref => ref
    .where('roomname', '==', roomname)
    .where('nickname', '==', this.nickname)
    ).get().subscribe(item => {
      if (item.empty){
        this.afs.collection('roomusers').add(user);
        this.router.navigate(['chatroom/', roomname]);
      }else{
        item.forEach(e=>{
        const Id = e.id;
        console.log(Id);
        this.afs.collection('roomusers').doc(Id).update(user);
        this.router.navigate(['chatroom/', roomname]);
      })
      }
    });
    }


  logout(){
    localStorage.removeItem('nickname');
    this.router.navigate(['/login']);
  }
}
