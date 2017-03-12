import { Component } from '@angular/core';
import { LoadingController, NavParams } from 'ionic-angular';
import { Observable } from 'rxjs';

import { PlayerDataService } from '../../../providers/player-data-service';

@Component({
    selector: 'recent-games',
    templateUrl: 'recent-games.html'
})
export class RecentGames {
    private player: any;
    private playerId: any;
    private lastMatchId: any = 0;
    private matchDetails: Array<any> = new Array();
    private historyShared: boolean = true;
    constructor(
        private navParams: NavParams,
        private loading: LoadingController,
        private playerData: PlayerDataService
    ) { }

    ionViewDidLoad() {
        this.player = this.navParams.get('player');
        this.playerId = this.player.steamid;

        let loader = this.loading.create({
            content: 'Getting match data...'
        });

        loader.present().then(() => {
            let match_history = this.playerData.getMatchHistory(this.playerId);

            this.loadMatchDetails(match_history)
                .subscribe((response) => {
                    this.matchDetails.push(...response);
                    console.log(this.matchDetails);
                    loader.dismiss();
                }, (err) => {
                    loader.dismiss();
                    this.historyShared = false;
                    console.log(err);
                });
        });
    };

    public onInfiniteScroll(scroll): void {
        let last_match_id = this.matchDetails[this.matchDetails.length - 1].match_id;
        let match_history = this.playerData.getMatchHistory(this.playerId, last_match_id);

        this.loadMatchDetails(match_history)
            .subscribe((response) => {
                response.splice(0, 1);
                this.matchDetails.push(...response);
                scroll.complete();
            }, (err) => {
                scroll.complete();
                this.historyShared = false;
                console.log(err);
            });
    }

    public loadMatchDetails(matchHistory: Observable<any>): Observable<any> {
        return matchHistory.flatMap((response) => {
            let matchDetailsObservables = [];
            let matchIds = response.map((match) => { return match.match_id; });
            matchIds.forEach((match_id) => { matchDetailsObservables.push(this.playerData.getMatchDetails(match_id)) });

            return Observable.forkJoin(matchDetailsObservables);
        });
    }
}