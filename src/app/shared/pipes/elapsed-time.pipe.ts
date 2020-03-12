import { Pipe, PipeTransform } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { take } from 'rxjs/operators';

import * as moment from 'moment';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
  name: 'elapsedTime'
})
export class ElapsedTimePipe implements PipeTransform {
  private static readonly API: string = 'http://worldclockapi.com/api/json/utc/now';

  public constructor(
    private httpClient: HttpClient,
    private translateService: TranslateService
  ) {
  }

  transform(value: any, ...args: unknown[]): Promise<string> {
    return new Promise<string>((resolve) => {
      let transformValue: string;

      this.httpClient.get<any>(
        ElapsedTimePipe.API
      ).pipe(
        take(1)
      ).subscribe((utcDateTime: any) => {
        const now: moment.Moment = moment(utcDateTime.currentDatetime);
        const elapsedTime: number = parseInt(now.format('YYYY')) - value;

        if (elapsedTime <= 1) {
          transformValue = this.translateService.instant('moviesListing.lessOne');
        } else if(elapsedTime < 2){
          transformValue = this.translateService.instant('moviesListing.lessTwo');
        }else if (elapsedTime > 2 && elapsedTime < 5) {
          transformValue = this.translateService.instant('moviesListing.twoAndFive');
        }else if (elapsedTime > 5 && elapsedTime < 10) {
          transformValue = this.translateService.instant('moviesListing.betweenFiveAndTen');
        }else{
          transformValue = this.translateService.instant('moviesListing.moreTen');
        }
        resolve(`${transformValue}`);
      });
    });
  }

}

