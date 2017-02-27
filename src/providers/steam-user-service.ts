import { Injectable } from '@angular/core';
import { Http, Response, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs';

import { SteamIDService } from '../providers/steamid-service';

@Injectable()
export class SteamUserService {
    constructor(public http: Http, public steamIDService: SteamIDService) { }

    public getPlayerProfile(): Observable<Response> {
        let baseUrl = 'http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002';
        let params: URLSearchParams = new URLSearchParams();
        params.set('key', '1027FC1AEF0AB63243EEA50A25AE5156');
        params.set('steamids', this.steamIDService.getID());

        return this.http.get(baseUrl, { search: params });
    }

    public getPlayerFriends(): Observable<Response> {
        let baseUrl = 'http://api.steampowered.com/ISteamUser/GetFriendList/v1';
        let params: URLSearchParams = new URLSearchParams();
        params.set('key', '1027FC1AEF0AB63243EEA50A25AE5156');
        params.set('steamid', this.steamIDService.getID());

        return this.http.get(baseUrl, { search: params });
    }

    public getFriendSummaries(friends: string[]): Observable<Response> {
        let baseUrl = 'http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002';
        let params: URLSearchParams = new URLSearchParams();
        params.set('key', '1027FC1AEF0AB63243EEA50A25AE5156');
        params.set('steamids', friends.toString());

        return this.http.get(baseUrl, { search: params });
    }
}