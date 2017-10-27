import { DbObject } from './dbobject';

export class Present extends DbObject
{
    public static tableName = "present";

    public wisherId: number;
    public giverId: number;
    public wishId: number;
    public description: string;
    public link: string;

    constructor(id: number, wisherId: number, giverId: number, wishId: number, description: string, link: string)
    {
        super(id);
        this.wisherId = wisherId;
        this.giverId = giverId;
        this.wishId = wishId;
        this.description = description;
        this.link = link;
    }

    static fromJson(jsonPresent): Present
    {
        return new Present(jsonPresent.p_id, 
                           jsonPresent.p_wisher, 
                           jsonPresent.p_giver, 
                           jsonPresent.p_wish, 
                           jsonPresent.p_pdescr, 
                           jsonPresent.p_plink);
    }

    public toJson()
    {
        return JSON.stringify({
            //"p_id": this.id,
            "p_wisher": this.wisherId,
            "p_giver": this.giverId,
            "p_wish": this.wishId,
            "p_pdescr": this.description,
            "p_plink": this.link
        });
    }

    public getTableName()
    {
        return Present.tableName;
    }
}