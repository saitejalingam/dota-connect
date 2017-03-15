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

    public sendNotification(player_name: string, token: string): Observable<any> {
        let headers: Headers = new Headers();
        headers.set('Content-Type', 'application/json');
        headers.set('Authorization', 'Bearer ' + pushToken);

        return this.http.post('https://api.ionic.io/push/notifications', {
            tokens: [token],
            profile: 'dev',
            notification: { 
                message: player_name + " has Invited you for a Game!",
                android: {
                    sound: 'match_ready'
                }
            }
        }, { headers: headers });
    }

    private getPushToken(steamid: any): Observable<any> {
        let users = this.db.collection('users');
        this.db.connect();
        return users.find({ id: steamid }).fetch();
    }

    public inviteToPlay(friend: any, player: any): void {
        this.getPushToken(friend.steamid)
            .flatMap((user) => {
                console.log(user);
                return this.sendNotification(player.personaname, user.token);
            })
            .subscribe(() => {
                this.db.disconnect();
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
            });
    }
}

const pushToken: string = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIyMzFlYzI2ZS02M2MxLTQ3ZWUtOGRmZC1hMzY3Y2Y1YzYyMzgifQ.DewsEnN3NCAl6AifArIo_OMRJhUMS4GNu89mL6WT4QY';
