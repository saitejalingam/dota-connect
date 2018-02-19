import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { MomentModule } from 'angular2-moment/moment.module';

import { Home } from './home';
import { PlayerProfile } from '../player-profile/player-profile';
import { FriendsList } from '../friends-list/friends-list';
import { Search } from '../search/search';

import { RecentGames } from '../components/recent-games/recent-games';
import { Messages } from '../components/messages/messages';
import { MatchDetailsCard } from '../components/match-details-card/match-details-card';
import { PlayerStatusPipe } from '../../providers/player-status-pipe';
import { InvitationModal } from '../components/invitation-modal/invitation-modal';

import { StorageService } from '../../providers/storage-service';
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
        FriendsList,
        Search,
        MatchDetailsCard,
        RecentGames,
        Messages,
        PlayerStatusPipe,
        InvitationModal
    ],
    providers: [
        StorageService,
        SteamUserService,
        PlayerDataService,
        IonicPushService
    ],
    bootstrap: [Home],
    entryComponents: [
        FriendsList,
        PlayerProfile,
        RecentGames,
        Messages,
        Search,
        InvitationModal
    ]
})
export class HomeModule { }
