import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'elapsedTime'
})
export class ElapsedTimePipe implements PipeTransform {

  transform(value: any, ...args: unknown[]): Promise<string> {
    return new Promise<string>((resolve) => {
      resolve(`Year : ${value}`);
    })
  }

}
