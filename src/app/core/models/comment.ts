import { HttpClient } from '@angular/common/http';

export class Comment {
    public idComment: number;   
    public idMovie: number;
    public idAccount: number;
    public date: Date;
    public comment: string;

    private httpClient: HttpClient;

    public constructor(
        httpClient: HttpClient
    ){
        this.httpClient = httpClient;
    }

    public deserialize(datas: any): Comment {
        Object.assign(this, datas);
        return this;
    }
}