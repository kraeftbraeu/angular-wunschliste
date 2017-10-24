import {Injectable} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import {DbObject} from '../data/dbobject';
import {User} from '../data/user';
import {Wish} from '../data/wish';
import {Present} from '../data/present';
import {StorageHandler} from './localstorage.service';
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { environment } from '../../src/environments/environment';

/*export interface IRestService
{
    readWishes(userId: number): Observable<Wish[]>;
}*/

@Injectable()
export class RestService //implements IRestService
{
    private serverUrl = environment.apiUrl + "api.php/";
    private userTable = "user";
    private wishTable = "wish";
    private presentTable = "present";

    constructor(
        private http: Http,
        private storageHandler: StorageHandler)
    {}

    readUsers(): Observable<User[]>
    {
        return this.http.get(this.serverUrl + this.userTable, this.getRequestOptions(true))
                        .map((response: Response) => response.json().map(res => User.fromJson(res)))
                        .catch(this.handleError);
    }

    readWishes(userId: number): Observable<Wish[]>
    {
        return this.http.get(this.serverUrl + this.wishTable + (userId === null ? "/" : "/w_user/" + userId), this.getRequestOptions(true))
                        .map((response: Response) => response.json().map(res => Wish.fromJson(res)))
                        .catch(this.handleError);
    }

    readAllPresents(): Observable<Present[]>
    {
        return this.http.get(this.serverUrl + this.presentTable + "/", this.getRequestOptions(true))
                        .map((response: Response) => response.json().map(res => Present.fromJson(res)))
                        .catch(this.handleError);
    }

    readPresents(userId: number, isForGiver: boolean): Observable<Present[]>
    {
        return this.http.get(this.serverUrl + this.presentTable + (isForGiver ? "/p_giver/" : "/p_wisher/") + userId, this.getRequestOptions(true))
                        .map((response: Response) => response.json().map(res => Present.fromJson(res)))
                        .catch(this.handleError);
    }

    /** return the id */
    createOrUpdate(dbObject: DbObject): Observable<number>
    {
        if(dbObject.id <= 0)
            return this.http.post(this.serverUrl + dbObject.getTableName(), dbObject.toJson(), this.getRequestOptions(true))
                            .map(this.extractData)
                            .catch(this.handleError);
        else
            return this.http.put(this.serverUrl + dbObject.getTableName() + "/" + dbObject.id, dbObject.toJson(), this.getRequestOptions(true))
                            .map(this.extractData)
                            .catch(this.handleError);
    }

    delete(dbObject: DbObject): Observable<any>
    {
        return this.http.delete(this.serverUrl + dbObject.getTableName() + "/" + dbObject.id, this.getRequestOptions(false));
    }

    private extractData(res: Response)
    {
        return res.json() || { };
    }

    private handleError(error: Response | any)
    {
        console.log("handleError: " + JSON.stringify(error));
        let errorMsg: string;
        if(error instanceof Response)
        {
            const body = error.json() || '';
            const err = body.error || JSON.stringify(body);
            errorMsg = `error ${error.status} - ${error.statusText || ''} ${err}`;
        }
        else
        {
            errorMsg = error.message ? error.message : error.toString();
        }
        console.error(errorMsg);
        return Observable.throw(errorMsg);
    }

    public getRequestOptions(addContentTypeJson: boolean): RequestOptions {
        // create authorization header with jwt token
        let loginUser = this.storageHandler.getCurrentUser();
        if (loginUser && loginUser.token && loginUser.token.token)
        {
            let headers;
            if(addContentTypeJson)
                headers = new Headers({
                    'Access-Control-Allow-Origin': '*',
                    'Authorization': loginUser.token.token,
                    'Content-Type': 'application/json'
                });
            else
                headers = new Headers({
                    'Access-Control-Allow-Origin': '*',
                    'Authorization': loginUser.token.token
                });
            return new RequestOptions({ headers: headers });
        }
    }
}