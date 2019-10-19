import { JwtService } from './jwt.service.js';

export class StorageHandler
{
    static setLoginUser(newUser, updateCurrentUser = true)
    {
        console.log("fct stub: updateCurrentUser not neccessary")
        if(newUser !== null)
            localStorage.setItem('currentUser', JSON.stringify(newUser));
        else
            localStorage.removeItem('currentUser');
        /*if(updateCurrentUser === true)
            this.currentUserSubject = newUser;*/
            /*this.ngZone.run(() => 
                this.currentUserSubject.next(newUser)
            );*/
    }

    static getCurrentUser()
    {
        return JSON.parse(localStorage.getItem('currentUser'));
    }
    
    static storeNewToken(token)
    {
        if (token)
        {
            console.log(token);
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            let decodedJwt = JwtService.decodeJwt(token);
            let currentUser = new Object();
            currentUser.id = decodedJwt.u_id;
            currentUser.username = decodedJwt.u_name;
            currentUser.token = token;

            StorageHandler.setLoginUser(currentUser);
        }
        return token;
    }
}