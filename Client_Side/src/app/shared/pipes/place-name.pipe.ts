import { Pipe, PipeTransform } from '@angular/core';
import { Store } from '@ngxs/store';
import { GetAllCities, GetAllPlaces } from '../store/locations/locations.actions';
import { LocationState } from '../store/locations/locations.reducer';
import { City, Place } from 'wos-api';

@Pipe({
  name: 'placeName'
})
export class PlaceNamePipe implements PipeTransform {

  constructor(private store: Store) {

  }

  async transform(placeId: any, cityId: string): Promise<string> {
    await this.store.dispatch(new GetAllCities({ force: false, published: false })).toPromise();

    const store = await this.store.dispatch(new GetAllPlaces({ request: { cityId }, force: false })).toPromise();
    const cities: City[] = store.locations && store.locations.cities || [];
    const city: City = cities.find(c => c.id === cityId);
    const places = city && city.places || [];
    const place: Place = places.find(p => p.id === placeId);
    
    return place && place.name;
  }

}
