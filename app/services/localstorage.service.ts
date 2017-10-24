import { Injectable, NgZone } from '@angular/core';
import { LoginUser } from '../data/loginUser';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from "rxjs/Rx";

@Injectable()
export class StorageHandler
{
    private currentUserSubject: BehaviorSubject<LoginUser>;
    currentUser: Observable<LoginUser>;

    constructor(private ngZone: NgZone)
    {
        this.currentUserSubject = new BehaviorSubject(this.getCurrentUser());
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public setNewLogin(newUser: LoginUser): void
    {
        if(newUser !== null)
            localStorage.setItem('currentUser', JSON.stringify(newUser));
        else
            localStorage.removeItem('currentUser');
        this.ngZone.run(() => 
            this.currentUserSubject.next(newUser)
        );
    }

    public getCurrentUser(): LoginUser
    {
        return JSON.parse(localStorage.getItem('currentUser'));
    }
}