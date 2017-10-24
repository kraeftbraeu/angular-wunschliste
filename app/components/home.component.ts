import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';

import { LoginUser } from '../data/loginUser';
import { StorageHandler } from '../services/localstorage.service';
import { AuthService } from '../services/auth.service';
import { AlertService } from '../services/alert.service';

@Component({
    selector: 'home',
    templateUrl: './home.component.html'
})
export class HomeComponent
{
    model: any = {};
    loading = false;
    currentUser: LoginUser;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private storageHandler: StorageHandler,
        private authService: AuthService,
        private alertService: AlertService
    )
    {}

    ngOnInit()
    {
        this.storageHandler.currentUser.subscribe(
            currentUser =>
            {
                if(currentUser === null)
                {
                    this.alertService.error("Kein angemeldeter Benutzer gefunden. Bitte neu anmelden.");
                    return;
                }
                this.currentUser = currentUser;
            },
            error => this.alertService.error(error)
        );
    }

    clickedChangePassword(f: NgForm)
    {
        this.loading = true;
        this.authService.changePassword(this.model.newPw1Wl2)
            .subscribe(
                data => {
                    this.alertService.success("Das Ändern des Passworts war erfolgreich.");
                    this.loading = false;
                    f.resetForm();
                },
                error => {
                    this.alertService.error(error);
                    this.loading = false;
                });
    }
}
