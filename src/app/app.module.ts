import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { HttpModule } from '@angular/http';
import { CloudSettings, CloudModule } from '@ionic/cloud-angular';

import { MyApp } from './app.component';
import { LoginModule } from '../login/login.module';
import { HomeModule } from '../pages/home/home.module';
import { StorageService } from '../providers/storage-service';
import { DotaDataService } from '../providers/dota-data-service';

const cloudSettings: CloudSettings = {
  'core': {
    'app_id': 'c10eb3fe'
  },
  'push': {
    'sender_id': '39704789164',
    'pluginConfig': {
      'ios': {
        'badge': true,
        'sound': true
      },
      'android': {
        'iconColor': '#343434'
      }
    }
  }
};

@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    CloudModule.forRoot(cloudSettings),
    HttpModule,
    
    LoginModule,
    HomeModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    StorageService,
    DotaDataService,
    { provide: ErrorHandler, useClass: IonicErrorHandler }
  ]
})
export class AppModule { }
