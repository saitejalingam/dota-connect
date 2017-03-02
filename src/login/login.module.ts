import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';

import { Login } from './login';

@NgModule({
    imports: [ IonicModule.forRoot(Login) ],
    exports: [Login],
    declarations: [Login],
    providers: [],
    bootstrap: [Login]
})
export class LoginModule { }
