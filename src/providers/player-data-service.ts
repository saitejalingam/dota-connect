import { Injectable } from '@angular/core';
import { Http, Response, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs';

@Injectable()
export class PlayerDataService {
    constructor(public http: Http) {}

    public getMatchHistory(player_id: any, last_match_id?: any): Observable<any> {
        let baseUrl = 'http://api.steampowered.com/IDOTA2Match_570/GetMatchHistory/v1';
        let params: URLSearchParams = new URLSearchParams();
        params.set('key', '1027FC1AEF0AB63243EEA50A25AE5156');
        params.set('account_id', player_id);
        params.set('min_players', '10');
        params.set('matches_requested', '7');
        last_match_id && params.set('start_at_match_id', last_match_id);

        return this.http.get(baseUrl, { search: params })
            .map((res: Response) => res.json())
            .map((res) => { return res.result.matches });
    }

    public getMatchDetails(match_id): Observable<any> {
        let baseUrl = 'http://api.steampowered.com/IDOTA2Match_570/GetMatchDetails/v1';
        let params: URLSearchParams = new URLSearchParams();
        params.set('key', '1027FC1AEF0AB63243EEA50A25AE5156');
        params.set('match_id', match_id);

        return this.http.get(baseUrl, { search: params })
            .map((res: Response) => res.json())
            .map((res) => { return res.result });
    }
}