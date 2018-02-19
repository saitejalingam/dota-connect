import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs';
import { Database } from '@ionic/cloud-angular';
import { AlertController } from 'ionic-angular';


@Injectable()
export class IonicPushService {
    constructor(private http: Http,
        private db: Database,
        private alert: AlertController
    ) { }

    private getPushToken(steamid: any): Observable<any> {
        let users = this.db.collection('users');
        this.db.connect();
        return users.find({ id: steamid }).fetch();
    }

    public inviteToPlay(friend: any, player: any): void {
        this.getPushToken(friend.steamid)
            .flatMap((user) => {
                console.log(user);
                return this.sendNotification(player, user.token);
            })
            .subscribe(() => {
                let msg = player.personaname + ' has Invited ' + friend.personaname + ' to Play!';
                this.generateInviteMessage(player, friend, msg);
                this.alert.create({
                    title: 'Invite sent!',
                    subTitle: 'Your invitation to play has been sent to ' + friend.personaname,
                    buttons: ['Dismiss']
                }).present();
            }, (err) => {
                this.alert.create({
                    title: 'Oops!',
                    subTitle: 'The player has not registered for push notifications!',
                    buttons: ['Dismiss']
                }).present();
            }, () => {
                this.db.disconnect();
            });
    }

    public sendNotification(player: any, token: string): Observable<any> {
        let headers: Headers = new Headers();
        headers.set('Content-Type', 'application/json');
        headers.set('Authorization', 'Bearer ' + pushToken);

        return this.http.post('https://api.ionic.io/push/notifications', {
            tokens: [token],
            profile: 'dev',
            notification: {
                title: 'Game Invite',
                message: player.personaname + ' has Invited you for a Game!',
                payload: { player: player },
                android: {
                    sound: 'match_ready'
                }
            }
        }, { headers: headers });
    }

    public generateInviteMessage(profile: any, friend: any, msg: string): Observable<any> {
        let message = {
            from: profile.steamid,
            to: friend.steamid,
            actionID: profile.steamid + friend.steamid,
            msg: msg,
            generated: true,
            time: Date.now()
        }

        this.db.connect();
        return this.db.collection('messages').store(message);
    }

    public sendMessageNotification(sender: any, recipient: any, msg: string) {
        let headers: Headers = new Headers();
        headers.set('Content-Type', 'application/json');
        headers.set('Authorization', 'Bearer ' + pushToken);

        this.getPushToken(recipient.steamid)
            .flatMap((user) => {
                return this.http.post('https://api.ionic.io/push/notifications', {
                    tokens: [user.token],
                    profile: 'dev',
                    notification: {
                        title: sender.personaname,
                        message: msg,
                        payload: { player: sender },
                    }
                }, { headers: headers });
            })
            .subscribe(() => {
                console.log('Successfully sent notification!');
            });
    }
}

const pushToken: string = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIyMzFlYzI2ZS02M2MxLTQ3ZWUtOGRmZC1hMzY3Y2Y1YzYyMzgifQ.DewsEnN3NCAl6AifArIo_OMRJhUMS4GNu89mL6WT4QY';
