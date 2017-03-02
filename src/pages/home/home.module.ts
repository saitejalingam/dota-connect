import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';

import { Home } from './home';
import { PlayerProfile } from '../player-profile/player-profile';
import { Page2 } from '../page2/page2'; 

import { SteamIDService } from '../../providers/steamid-service';
import { SteamUserService } from '../../providers/steam-user-service';
import { PlayerDataService } from '../../providers/player-data-service';

@NgModule({
    imports: [
        IonicModule.forRoot(Home)
    ],
    exports: [
        Home
    ],
    declarations: [
        Home,
        PlayerProfile,
        Page2
    ],
    providers: [
        SteamIDService,
        SteamUserService,
        PlayerDataService
    ],
    bootstrap: [Home],
    entryComponents: [
        PlayerProfile,
        Page2
    ]
})
export class HomeModule { }
