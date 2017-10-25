import { DbObject } from './dbobject';

export class User extends DbObject
{
    public static tableName = "user";

    public name: string;
    //private password: string;
    //private lastLogin: Date;
    public admin: string;

    constructor(id: number, name: string, /*password: string, lastLogin: Date,*/ admin: string)
    {
        super(id);
        this.name = name;
        //this.password = password;
        //this.lastLogin = lastLogin;
        this.admin = admin;
    }

    static fromJson(jsonUser)
    {
        return new User(jsonUser.u_id, 
                        jsonUser.u_name, 
                        //jsonUser.u_pw, 
                        //jsonUser.u_log, 
                        jsonUser.u_adm);
    }

    public toJson()
    {
        return JSON.stringify({
            //"u_id": this.id,
            "u_name": this.name,
            //"u_pw": this.password,
            //"u_log": this.lastLogin,
            "u_adm": this.admin
        });
    }

    public getTableName()
    {
        return User.tableName;
    }
}