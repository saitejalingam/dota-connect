import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { HttpModule } from '@angular/http';

import { MyApp } from './app.component';
import { LoginModule } from '../login/login.module';
import { HomeModule } from '../pages/home/home.module';
import { SteamIDService } from '../providers/steamid-service';

@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    LoginModule,
    HomeModule,
    HttpModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    SteamIDService,
    { provide: ErrorHandler, useClass: IonicErrorHandler }
  ]
})
export class AppModule { }
