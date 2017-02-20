import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';

@Component({
  selector: 'manage-accounts',
  templateUrl: 'manage-accounts.html'
})
export class ManageAccounts {
  constructor(public navCtrl: NavController) {
    
  }

  steamAccs: Array<Object> = [
    {
      name: 'Account 1'
    },
    {
      name: 'Account 2'
    }
  ]
}
