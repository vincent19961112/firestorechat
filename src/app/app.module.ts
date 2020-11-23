import { BrowserModule } from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

// firebase
import { environment } from '../environments/environment';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore'
//material
import { MaterialModule } from './models/material/material.module';

import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import {FlexLayoutModule} from '@angular/flex-layout';
import { AddroomComponent } from './components/addroom/addroom.component';
import { ChatroomComponent } from './components/chatroom/chatroom.component';
import { LoginComponent } from './components/login/login.component';
import { RoomlistComponent } from './components/roomlist/roomlist.component';
@NgModule({
  declarations: [
    AppComponent,
    AddroomComponent,
    ChatroomComponent,
    LoginComponent,
    RoomlistComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    AngularFirestoreModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    FlexLayoutModule

  ],
  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
