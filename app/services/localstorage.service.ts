import { Injectable, NgZone } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from "rxjs/Rx";
import { LoginUser } from '../data/loginUser';
import { JwtService } from './jwt.service';

@Injectable()
export class StorageHandler
{
    private currentUserSubject: BehaviorSubject<LoginUser>;
    currentUser: Observable<LoginUser>;

    constructor(private ngZone: NgZone,
                private jwtService: JwtService)
    {
        this.currentUserSubject = new BehaviorSubject(this.getCurrentUser());
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public setLoginUser(newUser: LoginUser, updateCurrentUser: boolean): void
    {
        if(newUser !== null)
            localStorage.setItem('currentUser', JSON.stringify(newUser));
        else
            localStorage.removeItem('currentUser');
        if(updateCurrentUser === true)
            this.ngZone.run(() => 
                this.currentUserSubject.next(newUser)
            );
    }

    public getCurrentUser(): LoginUser
    {
        return JSON.parse(localStorage.getItem('currentUser'));
    }
    
    public storeNewToken(response: Response, updateCurrentUser: boolean)
    {
        // login/pw change successful if there's a jwt token in the response
        let responseJson = response.json() || { };
        if (responseJson && responseJson.token)
        {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            let decodedJwt = this.jwtService.decodeJwt(responseJson.token);
            let currentUser = new LoginUser();
            currentUser.id = decodedJwt.u_id;
            currentUser.username = decodedJwt.u_name;
            currentUser.token = responseJson.token;

            this.setLoginUser(currentUser, updateCurrentUser);
        }
        return responseJson.token;
    }
}