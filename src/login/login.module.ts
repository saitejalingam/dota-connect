import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';

import { AuthService } from '../providers/auth-service'
import { Login } from './login';

@NgModule({
    imports: [ IonicModule.forRoot(Login) ],
    exports: [Login],
    declarations: [Login],
    providers: [AuthService],
    bootstrap: [Login]
})
export class LoginModule { }
