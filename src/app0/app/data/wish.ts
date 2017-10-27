import { DbObject } from './dbobject';

export class Wish extends DbObject
{
    public static tableName = "wish";

    public userId: number;
    public description: string;
    public link: string;

    constructor(id: number, userId: number, description: string, link: string)
    {
        super(id);
        this.userId = userId;
        this.description = description;
        this.link = link;
    }

    static fromJson(jsonWish)
    {
        return new Wish(jsonWish.w_id, 
                        jsonWish.w_user, 
                        jsonWish.w_descr, 
                        jsonWish.w_link);
    }

    public toJson()
    {
        return JSON.stringify({
            //"w_id": this.id,
            "w_user": this.userId,
            "w_descr": this.description,
            "w_link": this.link
        });
    }

    public getTableName()
    {
        return Wish.tableName;
    }
}