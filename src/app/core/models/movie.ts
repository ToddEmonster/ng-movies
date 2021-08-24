import * as moment from 'moment' ;
import { HttpClient } from '@angular/common/http';
import { take } from 'rxjs/operators';

export class Movie {
    public idMovie: number;
    public title: string;
    public year: number;
    public likes: number = 0;
    public animationState: string = 'initial';

    private httpClient: HttpClient;

    public constructor(
        httpClient: HttpClient
    ){
        this.httpClient = httpClient;
    }

    public get elapsedTime(): string {
        this.httpClient.get<any>(
            'http://worldclockapi.com/api/json/utc/now'
        ).pipe(
            take(1)
        ).subscribe((utcTime: any) => {
            // utcDateTime what i got from the API

        });

        const years: number = parseInt(moment().format('YYYY')) - this.year;
        return 'il y a ' + years.toString() + ' an(s)';
    }

    public deserialize(datas: any): Movie {
        Object.assign(this, datas);
        return this;
    }
}
