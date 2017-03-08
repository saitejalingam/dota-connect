import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs';

@Injectable()
export class IonicPushService {
    constructor(private http: Http) { }

    public sendNotification(player_name: string, token: string): Observable<any> {
        let headers: Headers = new Headers();
        headers.set('Content-Type', 'application/json');
        headers.set('Authorization', 'Bearer ' + pushToken);

        return this.http.post('https://api.ionic.io/push/notifications', {
            tokens: [token],
            profile: 'dev',
            notification: { message: player_name + " has Invited you for a Game!" }
        }, { headers: headers });
    }
}

const pushToken: string = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIyMzFlYzI2ZS02M2MxLTQ3ZWUtOGRmZC1hMzY3Y2Y1YzYyMzgifQ.DewsEnN3NCAl6AifArIo_OMRJhUMS4GNu89mL6WT4QY';
