import { Component, ViewChild } from '@angular/core';
import { Nav, NavController } from 'ionic-angular';

import { AuthService } from '../providers/auth-service';

@Component({
    selector: 'app-login',
    templateUrl: 'login.html'
})
export class Login {
    @ViewChild(Nav) nav: NavController;
    constructor(private authService: AuthService) { }

    loginWithGoogle() {
        this.authService.signInWithGoogle()
        .then(() => this.onLoginSuccess())    
    }

    private onLoginSuccess(): void {
        console.log('User ' + this.authService.displayName() + ' has been Authenticated!');
    }
}