import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { MomentModule } from 'angular2-moment/moment.module';

import { Home } from './home';
import { PlayerProfile } from '../player-profile/player-profile';
import { MatchDetailsCard } from '../components/match-details-card/match-details-card';

import { SteamIDService } from '../../providers/steamid-service';
import { SteamUserService } from '../../providers/steam-user-service';
import { PlayerDataService } from '../../providers/player-data-service';

@NgModule({
    imports: [
        IonicModule.forRoot(Home),
        MomentModule
    ],
    exports: [
        Home
    ],
    declarations: [
        Home,
        PlayerProfile,
        MatchDetailsCard
    ],
    providers: [
        SteamIDService,
        SteamUserService,
        PlayerDataService
    ],
    bootstrap: [Home],
    entryComponents: [
        PlayerProfile
    ]
})
export class HomeModule { }
