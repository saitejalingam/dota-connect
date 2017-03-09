import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { MomentModule } from 'angular2-moment/moment.module';

import { Home } from './home';
import { PlayerProfile } from '../player-profile/player-profile';

import { MatchDetailsCard } from '../components/match-details-card/match-details-card';
import { RecentGames } from '../components/recent-games/recent-games';
import { Messages } from '../components/messages/messages';

import { SteamIDService } from '../../providers/steamid-service';
import { SteamUserService } from '../../providers/steam-user-service';
import { PlayerDataService } from '../../providers/player-data-service';
import { IonicPushService } from '../../providers/ionic-push-service';

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
        MatchDetailsCard,
        RecentGames,
        Messages
    ],
    providers: [
        SteamIDService,
        SteamUserService,
        PlayerDataService,
        IonicPushService
    ],
    bootstrap: [Home],
    entryComponents: [
        PlayerProfile,
        RecentGames,
        Messages
    ]
})
export class HomeModule { }
