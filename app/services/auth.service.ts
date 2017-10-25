import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { JwtService } from './jwt.service';
import { StorageHandler } from './localstorage.service';
import { RestService } from './rest.service';
import { LoginUser } from '../data/loginUser';
import 'rxjs/add/operator/map'
import { environment } from '../../src/environments/environment';

@Injectable()
export class AuthService
{
    private loginServerUrl = environment.apiUrl + "login.php";
    private pwChangeServerUrl = environment.apiUrl + "changepw.php";

    constructor(
        private http: Http,
        private jwtService: JwtService,
        private restService: RestService,
        private storageHandler: StorageHandler)
    {}

    login(username: string, password: string)
    {
        return this.http.post(this.loginServerUrl, JSON.stringify({ user: username, pw: password }), this.restService.getRequestOptions(false))
                        .map((response: Response) => this.storageHandler.storeNewToken(response, true));
    }

    logout()
    {
        // remove user from local storage to log user out
        this.storageHandler.setLoginUser(null, true);
    }

    changePassword(newPassword: string)
    {
        return this.http.post(this.pwChangeServerUrl, JSON.stringify({ pw: newPassword }), this.restService.getRequestOptions(false))
                        .map((response: Response) => this.storageHandler.storeNewToken(response, false));
    }

    isTokenValid(token: any): boolean
    {
        if(token !== null)
        {
            let decodedJwt = this.jwtService.decodeJwt(token);
            return decodedJwt.exp.valueOf() * 1000 > new Date().valueOf();
        }
        return false;
    }
}