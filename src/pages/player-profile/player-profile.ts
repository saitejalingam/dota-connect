import { Component, OnInit } from '@angular/core';
import { NavController, LoadingController, NavParams } from 'ionic-angular';
import { Observable } from 'rxjs';
import { Database, Push, PushToken } from '@ionic/cloud-angular';

import { SteamIDService } from '../../providers/steamid-service';
import { PlayerDataService } from '../../providers/player-data-service';
import { IonicPushService } from '../../providers/ionic-push-service';

@Component({
  selector: 'player-profile',
  templateUrl: 'player-profile.html'
})
export class PlayerProfile {
  private playerId: any;
  public playerName: any;
  private lastMatchId: any = 0;
  private matchDetails: Array<any> = new Array();

  constructor(
    private navCtrl: NavController,
    private playerData: PlayerDataService,
    private IDService: SteamIDService,
    private loading: LoadingController,
    private navParams: NavParams,
    private push: Push,
    private ionicPushService: IonicPushService,
    private db: Database
  ) { }

  ionViewDidEnter() {
    this.playerName = this.navParams.get('playerName');
    this.playerId = this.navParams.get('playerId');

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
        console.log(err);
      });
  }

  public inviteToPlay(): void {
    this.getPushToken()
      .subscribe((user) => {
        console.log(user);
        this.ionicPushService.sendNotification(this.playerName, user.token)
        .subscribe(() => {
          console.log('completed');
        });
      });
  }

  public getPushToken(): Observable<any> {
    let users = this.db.collection('users');
    this.db.connect();
    return users.find({ id: this.playerId }).fetch();
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