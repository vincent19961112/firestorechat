import { ChatroomComponent } from './components/chatroom/chatroom.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RoomlistComponent } from './components/roomlist/roomlist.component';
import { AddroomComponent } from './components/addroom/addroom.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'roomlist', component: RoomlistComponent },
  { path: 'addroom', component: AddroomComponent },
  { path: 'chatroom/:roomid', component: ChatroomComponent },
  { path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [CommonModule, RouterModule.forRoot(routes)],
  exports: [RouterModule],
  declarations: []
})
export class AppRoutingModule {}
