import { Injectable } from '@angular/core';
import { Http, Response, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs';

@Injectable()
export class DotaDataService {
    constructor(public http: Http) { }

    public getHeroes(): Observable<Response> {
        let baseUrl = 'http://api.steampowered.com/IEconDOTA2_570/GetHeroes/v1';
        let params: URLSearchParams = new URLSearchParams();
        params.set('key', '1027FC1AEF0AB63243EEA50A25AE5156');
        params.set('language', 'en_US');

        return this.http.get(baseUrl, { search: params });
    }

    public getItems(): Observable<Response> {
        let baseUrl = 'http://api.steampowered.com/IEconDOTA2_570/GetGameItems/v1';
        let params: URLSearchParams = new URLSearchParams();
        params.set('key', '1027FC1AEF0AB63243EEA50A25AE5156');
        params.set('language', 'en_US');

        return this.http.get(baseUrl, { search: params });
    }
}