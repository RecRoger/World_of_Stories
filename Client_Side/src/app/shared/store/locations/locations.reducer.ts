import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector, Store } from '@ngxs/store';
import { SetLoader, SetError, SetInfo } from '../general/general.actions';
import { City, Place, LocationsService, RequestGetCities, RequestNewCity, RequestPublishCity, RequestUpdateCityDescription, RequestUpdateCityTravel, PublicTale, RequestNewCityDescription, RequestNewCityTravel, RequestRemoveCityDescription, RequestRemoveCityTravel, RequestGetPlaces, RequestNewPlace, RequestPublishPlace, RequestNewPlaceDescription, RequestNewPlaceEntry, RequestUpdatePlaceDescription, RequestUpdatePlaceEntry, RequestRemovePlaceDescription, RequestRemovePlaceEntry } from 'src/client-api';
import { GetAllCities, NewCity, PublishCity, EditCityStory, AddCityStory, DeleteCityStory, GetAllPlaces, NewPlace, PublishPlace, AddPlaceStory, EditPlaceStory, DeletePlaceStory } from '../locations/locations.actions';
import { patch, append, updateItem, removeItem } from '@ngxs/store/operators';
import { CityTabs, PlaceTabs } from '../../constants';

export interface LocationsStateModel {
  cities: City[];
}

@State<LocationsStateModel>({
  name: 'locations',
  defaults: {
    cities: []
  }
})
@Injectable()
export class LocationState {

  constructor(private store: Store, private locationsService: LocationsService) {

  }

  @Selector()
  static getCities(state: LocationsStateModel): City[] {
    return state.cities;
  }
  @Selector()
  static getPlaces(state: LocationsStateModel) {
    return (cityId: string): Place[] => {
      return state.cities.find(city => city.id === cityId).places;
    };
  }



  @Action(GetAllCities)
  async GetAllCities(ctx: StateContext<LocationsStateModel>, action: GetAllCities) {

    try {

      const req: RequestGetCities = { published: action.payload };

      const resp = await this.locationsService.getCities(req).toPromise();

      if (resp && resp.data && resp.data.cities) {
        ctx.patchState({
          cities: resp.data.cities
        });

      } else {
        this.store.dispatch(new SetError('No hay ciudades en el sistema'));
        return false;
      }
    } catch (err) {
      console.log('*** ERROR ***', err);

      this.store.dispatch(new SetError('Ha ocurrido un problema consultando las ciudades. Intente mas tarde'));
      return false;
    }
  }

  @Action(NewCity)
  async NewCity(ctx: StateContext<LocationsStateModel>, action: NewCity) {

    try {

      const req: RequestNewCity = action.payload;

      const resp = await this.locationsService.newCity(req).toPromise();

      if (resp && resp.data && resp.data.city) {
        ctx.setState(
          patch({
            cities: append([resp.data.city])
          })
        );

      } else {
        this.store.dispatch(new SetError('No se ha guardado la nueva ciudad'));
        return false;
      }
    } catch (err) {
      console.log('*** ERROR ***', err);

      this.store.dispatch(new SetError('Ha ocurrido un problema Creando la ciudad. Intente mas tarde'));
      return false;
    }
  }

  @Action(PublishCity)
  async PublishCity(ctx: StateContext<LocationsStateModel>, action: PublishCity) {

    try {

      const req: RequestPublishCity = action.payload;

      const resp = await this.locationsService.publishCity(req).toPromise();

      if (resp && resp.data && resp.data === 'OK') {
        ctx.setState(
          patch({
            cities: updateItem<City>(c => c.id === req.id, patch<City>({
              published: req.published,
              publishDate: req.published ? new Date().toDateString() : null,
            })
            )
          })
        );

      } else {
        this.store.dispatch(new SetError('No se ha guardado la nueva ciudad'));
        return false;
      }
    } catch (err) {
      console.log('*** ERROR ***', err);

      this.store.dispatch(new SetError('Ha ocurrido un problema Creando la ciudad. Intente mas tarde'));
      return false;
    }
  }

  @Action(AddCityStory)
  async AddCityStory(ctx: StateContext<LocationsStateModel>, action: AddCityStory) {

    try {
      const { type, cityId, tale } = action.payload;

      let resp;
      if (type === CityTabs.descripcion) {
        const req: RequestNewCityDescription = {
          description: {
            ...tale
          }
        };
        resp = await this.locationsService.newCityDescription(req).toPromise();
        if (resp && resp.data) {
          ctx.setState(
            patch({
              cities: updateItem<City>(c => c.id === cityId, patch<City>({
                description: append([{
                  ...resp.data
                }])
              })
              )
            })
          );

        }

      } else {
        const req: RequestNewCityTravel = {
          travel: {
            ...tale
          }
        };
        resp = await this.locationsService.newCityTravel(req).toPromise();
        if (resp && resp.data) {
          ctx.setState(
            patch({
              cities: updateItem<City>(c => c.id === cityId, patch<City>({
                travel: append([{
                  ...resp.data
                }])
              })
              )
            })
          );

        }

      }
      if (!resp.data) {
        this.store.dispatch(new SetError('No se ha podido crear la historia de la ciudad'));
        return false;
      }
    } catch (err) {
      console.log('*** ERROR ***', err);

      this.store.dispatch(new SetError('Ha ocurrido un problema generando la historia. Intente mas tarde'));
      return false;
    }
  }

  @Action(EditCityStory)
  async EditCityStory(ctx: StateContext<LocationsStateModel>, action: EditCityStory) {

    try {
      const { type, cityId, tale } = action.payload;

      let resp;
      if (type === CityTabs.descripcion) {
        const req: RequestUpdateCityDescription = {
          description: {
            ...tale
          }
        };
        resp = await this.locationsService.updateCityDescription(req).toPromise();
        if (resp && resp.data) {
          ctx.setState(
            patch({
              cities: updateItem<City>(c => c.id === cityId, patch<City>({
                description: updateItem(desc => desc.id === req.description.id, patch({
                  ...resp.data
                }))
              })
              )
            })
          );

        }

      } else {
        const req: RequestUpdateCityTravel = {
          travel: {
            ...tale
          }
        };
        resp = await this.locationsService.updateCityTravel(req).toPromise();
        if (resp && resp.data) {
          ctx.setState(
            patch({
              cities: updateItem<City>(c => c.id === cityId, patch<City>({
                travel: updateItem(desc => desc.id === req.travel.id, patch({
                  ...resp.data
                }))
              })
              )
            })
          );

        }

      }
      if (!resp.data) {
        this.store.dispatch(new SetError('No se ha podido eliminar la historia'));
        return false;
      }
    } catch (err) {
      console.log('*** ERROR ***', err);

      this.store.dispatch(new SetError('Ha ocurrido un problema eliminando la historia. Intente mas tarde'));
      return false;
    }
  }

  @Action(DeleteCityStory)
  async DeleteCityStory(ctx: StateContext<LocationsStateModel>, action: DeleteCityStory) {

    try {
      const { type, cityId, taleId } = action.payload;

      let resp;
      if (type === CityTabs.descripcion) {
        const req: RequestRemoveCityDescription = {
          descriptionId: taleId
        };
        resp = await this.locationsService.removeCityDescription(req).toPromise();
        if (resp && resp.data === 'OK') {
          ctx.setState(
            patch({
              cities: updateItem<City>(c => c.id === cityId, patch<City>({
                description: removeItem(desc => desc.id === taleId)
              })
              )
            })
          );

        }

      } else {
        const req: RequestRemoveCityTravel = {
          travelId: taleId
        };
        resp = await this.locationsService.removeCityTravel(req).toPromise();
        if (resp && resp.data === 'OK') {
          ctx.setState(
            patch({
              cities: updateItem<City>(c => c.id === cityId, patch<City>({
                travel: removeItem(desc => desc.id === taleId)
              })
              )
            })
          );

        }

      }
      if (!resp.data) {
        this.store.dispatch(new SetError('No se ha podido eliminar la historia'));
        return false;
      }
    } catch (err) {
      console.log('*** ERROR ***', err);

      this.store.dispatch(new SetError('Ha ocurrido un problema eliminando la historia. Intente mas tarde'));
      return false;
    }
  }



  @Action(GetAllPlaces)
  async GetAllPlaces(ctx: StateContext<LocationsStateModel>, action: GetAllPlaces) {

    try {

      const req: RequestGetPlaces = {
        ...action.payload
      };

      const resp = await this.locationsService.getPlaces(req).toPromise();

      if (resp && resp.data && resp.data.places) {
        ctx.setState(patch({
          cities: updateItem<City>(c => c.id === req.cityId, patch({
            places: resp.data.places
          }))
        }));
      } else {
        this.store.dispatch(new SetError('No hay lugares en esta ciudad'));
        return false;
      }
    } catch (err) {
      console.log('*** ERROR ***', err);

      this.store.dispatch(new SetError('Ha ocurrido un problema consultando los lugares. Intente mas tarde'));
      return false;
    }
  }

  @Action(NewPlace)
  async NewPlace(ctx: StateContext<LocationsStateModel>, action: NewPlace) {

    try {

      const req: RequestNewPlace = action.payload;

      const resp = await this.locationsService.newPlace(req).toPromise();

      if (resp && resp.data && resp.data.place) {
        ctx.setState(
          patch({
            cities: updateItem<City>(c => c.id === req.cityId, patch<City>({
              places: append([resp.data.place])
            }))
          })
        );

      } else {
        this.store.dispatch(new SetError('No se ha guardado el nuevo lugar'));
        return false;
      }
    } catch (err) {
      console.log('*** ERROR ***', err);

      this.store.dispatch(new SetError('Ha ocurrido un problema Creando el lugar. Intente mas tarde'));
      return false;
    }
  }

  @Action(PublishPlace)
  async PublishPlace(ctx: StateContext<LocationsStateModel>, action: PublishPlace) {

    try {

      const req: RequestPublishPlace = action.payload.place;
      const cityId = action.payload.cityId;

      const resp = await this.locationsService.publishPlace(req).toPromise();
      if (resp && resp.data && resp.data === 'OK') {
        ctx.setState(
          patch({
            cities: updateItem<City>(c => c.id === cityId, patch<City>({
              places: updateItem<Place>(p => p.id === req.id, patch<Place>({
                published: req.published,
                publishDate: req.published ? new Date().toDateString() : null,
              }))
            })
            )
          })
        );

      } else {
        this.store.dispatch(new SetError('No se ha guardado publicado el lugar'));
        return false;
      }
    } catch (err) {
      console.log('*** ERROR ***', err);

      this.store.dispatch(new SetError('Ha ocurrido un problema publicando el lugar. Intente mas tarde'));
      return false;
    }
  }

  @Action(AddPlaceStory)
  async AddPlaceStory(ctx: StateContext<LocationsStateModel>, action: AddPlaceStory) {

    try {
      const { type, cityId, placeId, tale } = action.payload;

      let resp;
      if (type === PlaceTabs.descripcion) {
        const req: RequestNewPlaceDescription = {
          description: {
            ...tale
          }
        };
        resp = await this.locationsService.newPlaceDescription(req).toPromise();
        if (resp && resp.data) {
          ctx.setState(
            patch({
              cities: updateItem<City>(c => c.id === cityId, patch<City>({
                places: updateItem<Place>(p => p.id === placeId, patch<Place>({
                  description: append([{
                    ...resp.data
                  }])
                }))
              })
              )
            })
          );

        }

      } else {
        const req: RequestNewPlaceEntry = {
          entry: {
            ...tale
          }
        };
        resp = await this.locationsService.newPlaceEntry(req).toPromise();
        if (resp && resp.data) {
          ctx.setState(
            patch({
              cities: updateItem<City>(c => c.id === cityId, patch<City>({
                places: updateItem<Place>(p => p.id === placeId, patch<Place>({
                  entry: append([{
                    ...resp.data
                  }])
                }))
              })
              )
            })
          );

        }

      }
      if (!resp.data) {
        this.store.dispatch(new SetError('No se ha podido crear la historia del lugar'));
        return false;
      }
    } catch (err) {
      console.log('*** ERROR ***', err);

      this.store.dispatch(new SetError('Ha ocurrido un problema generando la historia. Intente mas tarde'));
      return false;
    }
  }

  @Action(EditPlaceStory)
  async EditPlaceStory(ctx: StateContext<LocationsStateModel>, action: EditPlaceStory) {

    try {
      const { type, cityId, placeId, tale } = action.payload;

      let resp;
      if (type === PlaceTabs.descripcion) {
        const req: RequestUpdatePlaceDescription = {
          description: {
            ...tale
          }
        };
        resp = await this.locationsService.updatePlaceDescription(req).toPromise();
        if (resp && resp.data) {
          ctx.setState(
            patch({
              cities: updateItem<City>(c => c.id === cityId, patch<City>({
                places: updateItem<Place>(p => p.id === placeId, patch<Place>({
                  description: updateItem(desc => desc.id === req.description.id, patch({
                    ...resp.data
                  }))
                }))
              })
              )
            })
          );

        }

      } else {
        const req: RequestUpdatePlaceEntry = {
          entry: {
            ...tale
          }
        };
        resp = await this.locationsService.updatePlaceEntry(req).toPromise();
        if (resp && resp.data) {
          ctx.setState(
            patch({
              cities: updateItem<City>(c => c.id === cityId, patch<City>({
                places: updateItem<Place>(p => p.id === placeId, patch<Place>({
                  entry: updateItem(desc => desc.id === req.entry.id, patch({
                    ...resp.data
                  }))
                }))
              })
              )
            })
          );

        }

      }
      if (!resp.data) {
        this.store.dispatch(new SetError('No se ha podido eliminar la historia'));
        return false;
      }
    } catch (err) {
      console.log('*** ERROR ***', err);

      this.store.dispatch(new SetError('Ha ocurrido un problema eliminando la historia. Intente mas tarde'));
      return false;
    }
  }

  @Action(DeletePlaceStory)
  async DeletePlaceStory(ctx: StateContext<LocationsStateModel>, action: DeletePlaceStory) {

    try {
      const { type, cityId, placeId, taleId } = action.payload;

      let resp;
      if (type === PlaceTabs.descripcion) {
        const req: RequestRemovePlaceDescription = {
          descriptionId: taleId
        };
        resp = await this.locationsService.removePlaceDescription(req).toPromise();
        if (resp && resp.data === 'OK') {
          ctx.setState(
            patch({
              cities: updateItem<City>(c => c.id === cityId, patch<City>({
                places: updateItem<Place>(c => c.id === placeId, patch<Place>({
                  description: removeItem(desc => desc.id === taleId)
                }))
              }))
            })
          );
        }

      } else {
        const req: RequestRemovePlaceEntry = {
          entryId: taleId
        };
        resp = await this.locationsService.removePlaceEntry(req).toPromise();
        if (resp && resp.data === 'OK') {
          ctx.setState(
            patch({
              cities: updateItem<City>(c => c.id === cityId, patch<City>({
                places: updateItem<Place>(c => c.id === placeId, patch<Place>({
                  entry: removeItem(entry => entry.id === taleId)
                }))
              }))
            })
          );

        }

      }
      if (!resp.data) {
        this.store.dispatch(new SetError('No se ha podido eliminar la historia'));
        return false;
      }
    } catch (err) {
      console.log('*** ERROR ***', err);

      this.store.dispatch(new SetError('Ha ocurrido un problema eliminando la historia. Intente mas tarde'));
      return false;
    }
  }


}
