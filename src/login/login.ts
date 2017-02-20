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
            .catch((err) => console.log(err))
    }

    loginWithFacebook() {
        this.authService.signInWithFacebook()
            .then(() => this.onLoginSuccess())
            .catch((err) => console.log(err))
    }

    private onLoginSuccess(): void {
        console.log('User ' + this.authService.displayName() + ' has been Authenticated!');
    }
}