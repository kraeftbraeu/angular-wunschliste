import { DbObject } from './dbobject';

export class Filter extends DbObject
{
    public static tableName = "filter";

    public giverId: number;
    public wisherId: number;

    constructor(id: number, giverId: number, wisherId: number)
    {
        super(id);
        this.giverId = giverId;
        this.wisherId = wisherId;
    }

    static fromJson(jsonFilter)
    {
        return new Filter(jsonFilter.f_id, 
                          jsonFilter.f_giver, 
                          jsonFilter.f_wisher);
    }

    public toJson()
    {
        return JSON.stringify({
            //"f_id": this.id,
            "f_giver": this.giverId,
            "f_wisher": this.wisherId
        });
    }

    public getTableName()
    {
        return Filter.tableName;
    }
}