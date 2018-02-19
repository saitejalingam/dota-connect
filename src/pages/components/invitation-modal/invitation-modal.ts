import { Component } from '@angular/core';
import { Database } from '@ionic/cloud-angular';
import { ViewController, NavParams } from 'ionic-angular';

import { StorageService } from '../../../providers/storage-service';
import { IonicPushService } from '../../../providers/ionic-push-service';

@Component({
    selector: 'invitation-modal',
    templateUrl: 'invitation-modal.html'
})
export class InvitationModal {
    public profileID: any;
    public profile: any;
    public player: any;

    constructor(
        private viewCtrl: ViewController,
        private params: NavParams,
        private db: Database,
        private storage: StorageService,
        private ionicPush: IonicPushService
    ) {
        this.profileID = this.storage.getID();
        this.profile = this.storage.getProfile(this.profileID);
        this.player = this.params.get('player');
    }

    public acceptInvite() {
        let msg = this.profile.personaname + ' has accepted the Invite!';
        this.ionicPush.generateInviteMessage(this.profile, this.player, msg)
            .subscribe(() => {
                this.viewCtrl.dismiss();
            });
    }

    public declineInvite() {
        let msg = this.profile.personaname + ' has declined the Invite';
        this.ionicPush.generateInviteMessage(this.profile, this.player, msg)
            .subscribe(() => {
                this.viewCtrl.dismiss();
            });
    }

    public closeModal() {
        this.viewCtrl.dismiss();
    }
}