import { Component, OnInit } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';
import { Observable } from 'rxjs';

import { SteamIDService } from '../../providers/steamid-service';
import { PlayerDataService } from '../../providers/player-data-service';

@Component({
  selector: 'player-profile',
  templateUrl: 'player-profile.html'
})
export class PlayerProfile{
  private playerId: any;
  private last_match_id: any = 0;
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
              let match_details = [];
              let match_ids = response.map((match) => { return match.match_id; });
              match_ids.forEach((match_id) => { match_details.push(this.playerData.getMatchDetails(match_id)) });
              
              return Observable.forkJoin(match_details);
            })
            .subscribe((response) => {
                console.log(response);
                loader.dismiss();
            }, (err) => {
                loader.dismiss();
                console.log(err);
            });
        });
  };
}
