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
    year: string;
    daysLeftToChristmas: number;

    constructor(private storageHandler: StorageHandler, private alertService: AlertService) {
        this.currentUser = this.storageHandler.currentUser;
        var yearInt  = new Date().getFullYear();
        if(yearInt <= 2017)
            this.year = "2017";
        else
            this.year = "2017 - " + yearInt;
        this.daysLeftToChristmas = Math.ceil((new Date(yearInt + "-12-24 00:00:00").valueOf() - new Date().valueOf()) / 10000 / 360 / 24)
    }
}
