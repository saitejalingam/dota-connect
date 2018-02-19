import { Component, ViewChild } from '@angular/core';
import { Database } from '@ionic/cloud-angular';
import { LoadingController, NavParams, ToastController, Content } from 'ionic-angular';
import { Observable } from 'rxjs';

import { IonicPushService } from '../../../providers/ionic-push-service';

@Component({
    selector: 'messages-tab',
    templateUrl: 'messages.html'
})
export class Messages {
    @ViewChild(Content) content: Content;

    private messages: Array<any> = new Array();
    private message: string;
    private sender: any;
    private recipient: any;

    constructor(
        private db: Database,
        private loading: LoadingController,
        private navParams: NavParams,
        private toast: ToastController,
        private ionicPush: IonicPushService
    ) { }

    ionViewDidLoad() {
        this.sender = this.navParams.get('sender');
        this.recipient = this.navParams.get('recipient');

        let loader = this.loading.create({
            content: 'Fetching messages...'
        });

        loader.present().then(() => {
            this.db.connect();
            let collection = this.db.collection('messages');

            collection.findAll(
                { from: this.sender.steamid, to: this.recipient.steamid },
                { from: this.recipient.steamid, to: this.sender.steamid }
            ).watch().subscribe((result) => {
                this.messages = result.sort(this.sortByTime);
                this.limitMessages();
                setTimeout(() => {
                    this.content.scrollToBottom();
                }, 200);
                loader.dismiss();
            }, (error) => {
                loader.dismiss();
                if (!this.messages.length) {
                    this.toast.create({
                        message: 'Failed to fetch data. Some features may not work. Please restart the app.',
                        showCloseButton: true,
                        position: 'bottom',
                        duration: 10000
                    }).present();
                }
            });
        });
    }

    private limitMessages() {
        if (this.messages.length > 20) {
            this.db.collection("messages").remove(this.messages[0]);
        }
    }

    private sortByTime(a: any, b: any): number {
        if (a.time > b.time) { return 1; }
        if (a.time < b.time) { return -1 };
        return 0;
    }

    private sendMessage() {
        if (this.message.length) {
            this.db.collection('messages').store({
                from: this.sender.steamid,
                to: this.recipient.steamid,
                actionID: this.sender.steamid + this.recipient.steamid,
                msg: this.message,
                time: Date.now()
            }).subscribe(() => {
                this.message = '';
            }, (err) => {
                this.toast.create({
                    message: 'Sorry! Failed to send messages at this moment. Please try again later.',
                    showCloseButton: true,
                    position: 'bottom',
                    duration: 10000
                }).present();
            });
        }
    }

    private getMessageClass(message: any): string {
        if (message.generated) { return 'generated-msg'; }
        else { return message.from === this.sender.steamid ? 'sent-msg' : 'received-msg'; }
    }
}