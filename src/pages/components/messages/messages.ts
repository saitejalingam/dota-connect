import { Component, AfterViewChecked, ViewChild } from '@angular/core';
import { Database } from '@ionic/cloud-angular';
import { LoadingController, NavParams, AlertController } from 'ionic-angular';
import { Observable } from 'rxjs';

@Component({
    selector: 'messages-tab',
    templateUrl: 'messages.html'
})
export class Messages implements AfterViewChecked {
    @ViewChild('msgContent') private msgContent;

    private messages: Array<any> = new Array();
    private message: string;
    private sender: any;
    private recipient: any;

    constructor(
        private db: Database,
        private loading: LoadingController,
        private navParams: NavParams,
        private alert: AlertController
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
                { actionID: this.sender.steamid + this.recipient.steamid },
                { actionID: this.recipient.steamid + this.sender.steamid }
            ).watch().subscribe((result) => {
                this.messages = result.sort(this.sortByTime);
                this.scrollToBottom();
                loader.dismiss();
            }, (error) => {
                this.alert.create({
                    title: 'API Failed',
                    message: 'Oops! Failed to fetch messages. Please try again.',
                    buttons: ['Dismiss']
                }).present();
                loader.dismiss();
            });
        });
    }

    ngAfterViewChecked() {
        this.scrollToBottom();
    }

    private sortByTime(a: any, b: any): number {
        if (a.time > b.time) { return 1; }
        if (a.time < b.time) { return -1 };
        return 0;
    }

    private scrollToBottom(): void {
        try {
            this.msgContent.scrollTop = this.msgContent.scrollHeight;
        } catch (err) { }
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
                this.alert.create({
                    title: 'Send failed',
                    message: 'Sorry! Failed to send messages at this moment. Please try again later.',
                    buttons: ['Dismiss']
                }).present();
            });
        }
    }
}