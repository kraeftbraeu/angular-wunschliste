import { StorageHandler } from './localstorage.service.js';
//import { environment } from '../../environments/environment';

export class RestService
{
    static serverUrl = "api.php/";
    //static serverUrl = environment.apiUrl + "api.php/";

    static readUsers()
    {
        return fetch(RestService.serverUrl + 'user/', RestService.getRequestOptions(true))
            .then(response => response.json())
            .catch(RestService.handleError);
    }

    static readWishes(userId)
    {
        return fetch(RestService.serverUrl + (userId === null ? 'wish/' : 'wish/w_user/' + userId), RestService.getRequestOptions(true))
            .then(response => response.json())
            .catch(RestService.handleError);
    }

    static readAllPresents()
    {
        return fetch(RestService.serverUrl + 'present/', RestService.getRequestOptions(true))
            .then(response => response.json())
            .catch(RestService.handleError);
    }

    static readPresents(userId, isForGiver)
    {
        return fetch(RestService.serverUrl + (isForGiver ? 'present/p_giver/' : 'present/p_wisher/') + userId, RestService.getRequestOptions(true))
            .then(response => response.json())
            .catch(RestService.handleError);
    }

    static readFiltersForGiver(giverId)
    {
        return fetch(serverUrl + 'filter/f_giver/' + giverId, RestService.getRequestOptions(true))
            .then(response => response.json())
            .catch(RestService.handleError);
    }

    /** return the id */
    static createOrUpdate(dbObject)
    {
        let headers = RestService.getRequestOptions(true);
        headers.method = 'POST';
        headers.body = dbObject;

        if(dbObject.id <= 0)
            return fetch(RestService.serverUrl + dbObject.getTableName(), headers)
                .then(jsonObject => RestService.extractContentAndUpdateToken(jsonObject));
        else
            return fetch(RestService.serverUrl + dbObject.getTableName() + '/' + dbObject.id, headers)
                .then(jsonObject => RestService.extractContentAndUpdateToken(jsonObject));
    }

    static delete(dbObject)
    {
        return this.http.delete(this.serverUrl + dbObject.getTableName() + "/" + dbObject.id, RestService.getRequestOptions(false));
    }

    static deleteWish(wish, isForceDeletion)
    {
        if(isForceDeletion) {
            let headers = RestService.getRequestOptions(false);
            headers.method = 'DELETE';
            fetch(this.serverUrl + 'present/p_wish/' + wish.id, headers)
                .then(() => console.log('deleted presents for wish#' + wish.id))
                .catch((error) => console.error(error));
        }
        return RestService.delete(wish);
    }

    static extractContent(response)
    {
        return RestService.extractContentAndUpdateToken(response);
    }
    
    static extractContentAndUpdateToken(response)
    {
        StorageHandler.storeNewToken(response);
        return response.json().content || { };
    }

    static handleError(error)
    {
        console.log("handleError: " + JSON.stringify(error));
        let errorMsg;
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
        return errorMsg;
    }

    static getRequestOptions(addContentTypeJson)
    {
        // create authorization header with jwt token
        let loginUser = StorageHandler.getCurrentUser();
        if (loginUser && loginUser.token)
        {
            let headers;
            if(addContentTypeJson)
                headers = {
                    'Access-Control-Allow-Origin': '*',
                    'Authorization': loginUser.token,
                    'Content-Type': 'application/json'
                };
            else
                headers = {
                    'Access-Control-Allow-Origin': '*',
                    'Authorization': loginUser.token
                };
            return headers;
            //return new RequestOptions({ headers: headers });
        }
    }
}