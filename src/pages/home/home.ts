import { Component, OnInit } from '@angular/core';

import { AuthService } from '../../providers/auth-service';
import { ManageAccounts } from '../manage-accounts/manage-accounts'

@Component({
    selector: 'app-home',
    templateUrl: 'home.html'
})
export class Home implements OnInit {
    public rootPage: any = ManageAccounts;
    constructor(private authService: AuthService) { }

    ngOnInit() { }

    public navigateTo(): void {
       
    }

    public signOut(): void {
        console.log('Signing out!');
        this.authService.signOut();
    }
}