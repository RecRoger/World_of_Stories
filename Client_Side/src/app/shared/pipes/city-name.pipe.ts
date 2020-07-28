import { Pipe, PipeTransform } from '@angular/core';
import { Store } from '@ngxs/store';
import { LocationState } from '../store/locations/locations.reducer';
import { Observable } from 'rxjs';
import { GetAllCities } from '../store/locations/locations.actions';

@Pipe({
  name: 'cityName'
})
export class CityNamePipe implements PipeTransform {

  constructor(private store: Store) {

  }

  async transform(cityId: any): Promise<string> {
    await this.store.dispatch(new GetAllCities({ force: false, published: false })).toPromise();

    const cities = this.store.selectSnapshot(LocationState.getCities);
    const city = cities.find(c => c.id === cityId);

    return city && city.name;

  }

}
