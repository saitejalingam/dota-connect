import { Injectable, EventEmitter } from '@angular/core';
import { UserManager, User } from 'oidc-client';
import { Http } from '@angular/http';


@Injectable()
export class SteamUserService {
    mgr: UserManager = new UserManager(settings);
    userLoadededEvent: EventEmitter<User> = new EventEmitter<User>();
    currentUser: User;
    loggedIn: boolean = false;


    constructor(private http: Http) { }

    public linkSteamAccount(): void {
        console.log('in steam service');

        this.mgr.signinSilent()
        .then((response) => {
            console.log(response);
        })
        .catch((err) => {
            console.log(err);
        })
    }
}

const settings: any = {
    authority: 'http://steamcommunity.com/openid',
    client_id: 'dota-connect',
    redirect_uri: 'http://localhost:8100/',
    response_type: 'id_token token',
    scope: 'openid email roles',

    automaticSilentRenew: false,
    loadUserInfo: true,
    silent_redirect_uri: 'http://localhost:8100/'
};