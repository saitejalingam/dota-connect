import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'player-profile',
  templateUrl: 'player-profile.html'
})
export class PlayerProfile {
  constructor(public navCtrl: NavController) {
    console.log('in player profile');
   }
}
