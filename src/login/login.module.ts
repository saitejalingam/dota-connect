import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';

import { SteamIDService } from '../providers/steamid-service'
import { Login } from './login';

@NgModule({
    imports: [ IonicModule.forRoot(Login) ],
    exports: [Login],
    declarations: [Login],
    providers: [SteamIDService],
    bootstrap: [Login]
})
export class LoginModule { }
