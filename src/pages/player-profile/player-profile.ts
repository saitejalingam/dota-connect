import { Component, OnInit } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';
import { Observable } from 'rxjs';

import { SteamIDService } from '../../providers/steamid-service';
import { PlayerDataService } from '../../providers/player-data-service';

@Component({
  selector: 'player-profile',
  templateUrl: 'player-profile.html'
})
export class PlayerProfile {
  private playerId: any;
  private lastMatchId: any = 0;
  private matchDetails: Array<any> = new Array();

  constructor(
    private navCtrl: NavController,
    private playerData: PlayerDataService,
    private IDService: SteamIDService,
    private loading: LoadingController
  ) { }

  ionViewDidEnter() {
    this.playerId = this.IDService.getID();
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
          console.log(err);
        });
    });
  };

  public onInfiniteScroll(scroll) {
    let last_match_id = this.matchDetails[this.matchDetails.length - 1].match_id;
    let match_history = this.playerData.getMatchHistory(this.playerId, last_match_id);

    this.loadMatchDetails(match_history)
      .subscribe((response) => {
        response.splice(0, 1);
        this.matchDetails.push(...response);
        scroll.complete();
      }, (err) => {
        scroll.complete();
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