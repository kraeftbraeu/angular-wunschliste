import { Component, OnInit } from '@angular/core';
import { StorageHandler } from './services/localstorage.service';
import { AlertService } from './services/alert.service';
import { LoginUser } from './data/loginUser';
import { Observable } from 'rxjs/Observable';

@Component({
    selector: 'app',
    templateUrl: './app.component.html'
})
export class AppComponent
{
    currentUser: Observable<LoginUser>;
    year: number;
    daysLeftToChristmas: number;

    constructor(private storageHandler: StorageHandler, private alertService: AlertService) {
        this.currentUser = this.storageHandler.currentUser;
        this.year = new Date().getFullYear();
        this.daysLeftToChristmas = Math.ceil((new Date(this.year + "-12-24 00:00:00").valueOf() - new Date().valueOf()) / 10000 / 360 / 24)
    }
}
