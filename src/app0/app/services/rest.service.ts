import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { DbObject } from '../data/dbobject';
import { User } from '../data/user';
import { Wish } from '../data/wish';
import { Present } from '../data/present';
import { Filter } from '../data/filter';
import { StorageHandler } from './localstorage.service';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class RestService
{
    private serverUrl = environment.apiUrl + "api.php/";

    constructor(
        private http: Http,
        private storageHandler: StorageHandler)
    {}

    readUsers(): Observable<User[]>
    {
        return this.http.get(this.serverUrl + User.tableName, this.getRequestOptions(true))
                        .map((response: Response) => this.extractContent(response).map(res => User.fromJson(res)))
                        .catch(this.handleError);
    }

    readWishes(userId: number): Observable<Wish[]>
    {
        return this.http.get(this.serverUrl + Wish.tableName + (userId === null ? "/" : "/w_user/" + userId), this.getRequestOptions(true))
                        .map((response: Response) => this.extractContent(response).map(res => Wish.fromJson(res)))
                        .catch(this.handleError);
    }

    readAllPresents(): Observable<Present[]>
    {
        return this.http.get(this.serverUrl + Present.tableName + "/", this.getRequestOptions(true))
                        .map((response: Response) => this.extractContent(response).map(res => Present.fromJson(res)))
                        .catch(this.handleError);
    }

    readPresents(userId: number, isForGiver: boolean): Observable<Present[]>
    {
        return this.http.get(this.serverUrl + Present.tableName + (isForGiver ? "/p_giver/" : "/p_wisher/") + userId, this.getRequestOptions(true))
                        .map((response: Response) => this.extractContent(response).map(res => Present.fromJson(res)))
                        .catch(this.handleError);
    }

    readFiltersForGiver(giverId: number): Observable<Filter[]>
    {
        return this.http.get(this.serverUrl + Filter.tableName + "/f_giver/" + giverId, this.getRequestOptions(true))
                        .map((response: Response) => this.extractContent(response).map(res => Filter.fromJson(res)))
                        .catch(this.handleError);
    }

    /** return the id */
    createOrUpdate(dbObject: DbObject): Observable<number>
    {
        if(dbObject.id <= 0)
            return this.http.post(this.serverUrl + dbObject.getTableName(), dbObject.toJson(), this.getRequestOptions(true))
                            .map(res => this.extractContentAndUpdateToken(res, this.storageHandler))
                            .catch(this.handleError);
        else
            return this.http.put(this.serverUrl + dbObject.getTableName() + "/" + dbObject.id, dbObject.toJson(), this.getRequestOptions(true))
                            .map(res => this.extractContentAndUpdateToken(res, this.storageHandler))
                            .catch(this.handleError);
    }

    delete(dbObject: DbObject): Observable<any>
    {
        return this.http.delete(this.serverUrl + dbObject.getTableName() + "/" + dbObject.id, this.getRequestOptions(false));
    }

    private extractContent(res: Response)
    {
        if(this.storageHandler !== null && this.storageHandler !== undefined)
            this.storageHandler.storeNewToken(res, false);
        return res.json().content || { };
    }
    
    private extractContentAndUpdateToken(res: Response, storageHandler: StorageHandler)
    {
        // TODO: ugly workaround, but otherwise this.storageHandler is undefined in createOrUpdate()
        if(storageHandler !== null && storageHandler !== undefined)
            storageHandler.storeNewToken(res, false);
        return res.json().content || { };
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
        if (loginUser && loginUser.token)
        {
            let headers;
            if(addContentTypeJson)
                headers = new Headers({
                    'Access-Control-Allow-Origin': '*',
                    'Authorization': loginUser.token,
                    'Content-Type': 'application/json'
                });
            else
                headers = new Headers({
                    'Access-Control-Allow-Origin': '*',
                    'Authorization': loginUser.token
                });
            return new RequestOptions({ headers: headers });
        }
    }
}