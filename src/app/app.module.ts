import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { LoginModule } from '../login/login.module';
import { HomeModule } from '../pages/home/home.module';

import { AngularFireModule, AuthProviders, AuthMethods } from 'angularfire2';

export const firebaseConfig = {
  apiKey: "AIzaSyC9ridd0YITUMwhcBdnQSb0rZDVh0vdSHU",
  authDomain: "dota-social-70c1d.firebaseapp.com",
  databaseURL: "https://dota-social-70c1d.firebaseio.com",
  storageBucket: "dota-social-70c1d.appspot.com",
  messagingSenderId: "948042903054"
}

export const firebaseAuthConfig = {
  provider: AuthProviders.Google,
  method: AuthMethods.Redirect
};

@NgModule({
  declarations: [
    MyApp  
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig, firebaseAuthConfig),
    LoginModule,
    HomeModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}]
})
export class AppModule {}
