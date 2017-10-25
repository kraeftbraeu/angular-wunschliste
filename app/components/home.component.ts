import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators, ValidatorFn, AbstractControl } from '@angular/forms';

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
    currentUser: LoginUser;
    pwChangeForm = new FormGroup({
        'mpw1': new FormControl("", Validators.required),
        'mpw2': new FormControl("", [
            Validators.required,
            this.equalValuesValidator()
        ])
    });
    isFormSubmitted = false;
    loading = false;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private storageHandler: StorageHandler,
        private authService: AuthService,
        private alertService: AlertService
    )
    {}

    private equalValuesValidator(): ValidatorFn
    {
        return (control: AbstractControl): {[key: string]: any} => {
            const isEqual = this.pwChangeForm && this.pwChangeForm.get('mpw1').value === this.pwChangeForm.get('mpw2').value;
            return isEqual ? null : {'pwsNotEqual': {value: control.value}};
        };
    }

    ngOnInit()
    {
        this.storageHandler.currentUser.subscribe(
            currentUser => {
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

    clickedChangePassword()
    {
        this.isFormSubmitted = true;
        if(this.pwChangeForm.valid)
        {
            this.loading = true;
            this.authService.changePassword(this.pwChangeForm.get('mpw1').value)
                .subscribe(
                    data => {
                        this.alertService.success("Das Ändern des Passworts war erfolgreich.");
                        this.loading = false;
                        this.isFormSubmitted = false;
                        this.pwChangeForm.reset();
                    },
                    error => {
                        this.alertService.error(error);
                        this.loading = false;
                        this.isFormSubmitted = false;
                    });
        }
    }
}
