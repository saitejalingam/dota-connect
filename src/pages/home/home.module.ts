import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';

import { Home } from './home';
import { ManageAccounts } from '../manage-accounts/manage-accounts';
import { Page2 } from '../page2/page2'; 

import { SteamIDService } from '../../providers/steamid-service';
import { SteamUserService } from '../../providers/steam-user-service';

@NgModule({
    imports: [
        IonicModule.forRoot(Home)
    ],
    exports: [
        Home
    ],
    declarations: [
        Home,
        ManageAccounts,
        Page2
    ],
    providers: [
        SteamIDService,
        SteamUserService
    ],
    bootstrap: [Home],
    entryComponents: [
        ManageAccounts,
        Page2
    ]
})
export class HomeModule { }
