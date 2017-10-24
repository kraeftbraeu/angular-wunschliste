export abstract class DbObject
{
    public id: number;

    constructor(id: number)
    {
        this.id = id;
    }

    //public static abstract fromJson(jsonObject): DbObject;

    public abstract toJson(): string;

    public abstract getTableName(): string;
}