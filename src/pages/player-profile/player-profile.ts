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
      this.playerData.getMatchHistory(this.playerId)
        .flatMap((response) => {
          let matchDetailsObservables = [];
          let matchIds = response.map((match) => { return match.match_id; });
          matchIds.forEach((match_id) => { matchDetailsObservables.push(this.playerData.getMatchDetails(match_id)) });

          return Observable.forkJoin(matchDetailsObservables);
        })
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
}