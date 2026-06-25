import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, map } from 'rxjs';
import { CitiesService, City, Place } from '@core/api';
import { AlertService } from '@core/services/alert.service';

interface LocationState {
  cities?: City[],
  places?: { [cityId: string]: Place[] },
}
@Injectable({
  providedIn: 'root'
})
export class LocationsService {
  private readonly citisService = inject(CitiesService)
  private readonly alertService = inject(AlertService)
  private state$ = new BehaviorSubject<LocationState>({});

  private get state() { return this.state$.value }

  public cities$: Observable<City[]> = this.state$.pipe(map(
    state => state.cities || []
  ))

  public cityPlaces$(cityId: string): Observable<Place[]> {
    return this.state$.pipe(map(
      (state: LocationState) => (state?.places && state.places[cityId]) || []
    ))
  }

  public getAllCities(published: boolean): Observable<void> {
    return this.citisService.getCities({ published }).pipe(
      catchError(err => {
        this.alertService.setError(err)
        throw err
      }),
      map(response => {
        if (response.data?.cities?.length) {
          this.updateState({ cities: response.data?.cities })
        } else {
          this.updateState({ cities: [] })
        }
      })
    )
  }

  public getCity(id: string): Observable<City | null> {
    return this.citisService.getCity({ id }).pipe(
      catchError(err => {
        this.alertService.setError(err)
        throw err
      }),
      map(response => {
        if (response.data?.city) {
          const { city } = response.data
          const cities = this.state.cities || []
          const cityIndex = cities?.findIndex(c => c.id === city.id) || 0
          cities[cityIndex] = city
          this.updateState({ cities })
          return city
        } else {
          return null
        }
      })
    )
  }

  public getCitySnapshot(id: string): City | null {
    return this.state.cities?.find(c => c.id === id) || null
  }

  private updateState(newState: Partial<LocationState>): void {
    this.state$.next({
      ...this.state$.value,
      ...newState
    });
  }

}