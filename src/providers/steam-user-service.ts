import { Injectable } from '@angular/core';
import { Http, Response, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs';

import { StorageService } from '../providers/storage-service';

@Injectable()
export class SteamUserService {
    private _profile: any;
    private _friendIDs: any;
    private _friends: any;

    constructor(public http: Http, public storage: StorageService) { }

    get profile(): any {
        return this._profile;
    }

    set profile(profile: any) {
        console.log(profile);
        this._profile = profile;
    }

    get friendIDs(): any {
        return this._friendIDs;
    }

    set friendIDs(friendIDs: any) {
        console.log(friendIDs);
        this._friendIDs = friendIDs;
    }

    get friends(): any {
        return this._friends;
    }

    set friends(friends: any) {
        console.log(friends);
        this._friends = friends;
    }

    public getPlayerProfile() {
        let baseUrl = 'http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002';
        let params: URLSearchParams = new URLSearchParams();
        params.set('key', '1027FC1AEF0AB63243EEA50A25AE5156');
        params.set('steamids', this.storage.getID());

        return this.http.get(baseUrl, { search: params })
            .map((res: Response) => res.json())
            .map((res) => { return res.response.players[0] });
    }

    public getPlayerFriends() {
        let baseUrl = 'http://api.steampowered.com/ISteamUser/GetFriendList/v1';
        let params: URLSearchParams = new URLSearchParams();
        params.set('key', '1027FC1AEF0AB63243EEA50A25AE5156');
        params.set('steamid', this.storage.getID());

        return this.http.get(baseUrl, { search: params })
            .map((res: Response) => res.json())
            .map((res) => { return res.friendslist.friends });
    }

    public getFriendSummaries() {
        let baseUrl = 'http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002';
        let params: URLSearchParams = new URLSearchParams();
        params.set('key', '1027FC1AEF0AB63243EEA50A25AE5156');
        params.set('steamids', this.friendIDs.toString());

        return this.http.get(baseUrl, { search: params })
            .map((res: Response) => res.json())
            .map((res) => { return res.response.players });
    }
}