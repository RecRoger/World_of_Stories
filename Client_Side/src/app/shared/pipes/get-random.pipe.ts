import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'getRandom'
})
export class GetRandomPipe implements PipeTransform {

  transform(array: any[], published?: boolean): any {
    // TODO - filtrar publicados
    // if (published) {
    //   array = array.filter(item => item.published);
    // }

    if (array && array.length > 0) {
      const randomElement = array[Math.floor(Math.random() * array.length)];
      return randomElement;

    } else {

      return null;
    }
  }

}
