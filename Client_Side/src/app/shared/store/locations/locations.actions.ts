import { RequestNewCity, RequestPublishCity, TaleEdition, NewCityTale, RequestGetPlaces, RequestNewPlace, RequestPublishPlace, NewPlaceTale, RequestGetPlace } from 'src/client-api';
import { CityTabs, PlaceTabs } from '../../constants';

export class GetAllCities {
    static readonly type = '[Locations] Get All Cities';
    constructor(public payload: { published: boolean, force?: boolean }) { }
}
export class GetCityData {
    static readonly type = '[Locations] Get City Data';
    constructor(public payload: { cityId: string, force?: boolean }) { }
}
export class NewCity {
    static readonly type = '[Locations] New City';
    constructor(public payload: RequestNewCity) { }
}
export class PublishCity {
    static readonly type = '[Locations] Publish City';
    constructor(public payload: RequestPublishCity) { }
}
export class AddCityStory {
    static readonly type = '[Locations] New City Story';
    constructor(public payload: { type: CityTabs, cityId: string, tale: NewCityTale }) { }
}
export class EditCityStory {
    static readonly type = '[Locations] Edit City Story';
    constructor(public payload: { type: CityTabs, cityId: string, tale: TaleEdition }) { }
}
export class DeleteCityStory {
    static readonly type = '[Locations] Delete City Story';
    constructor(public payload: { type: CityTabs, cityId: string, taleId: string }) { }
}

export class GetAllPlaces {
    static readonly type = '[Locations] Get All Places';
    constructor(public payload: { request: RequestGetPlaces, force?: boolean }) { }
}
export class GetPlaceData {
    static readonly type = '[Locations] Get Place Data';
    constructor(public payload: { cityId: string, placeId: string, force?: boolean }) { }
}
export class NewPlace {
    static readonly type = '[Locations] New Place';
    constructor(public payload: RequestNewPlace) { }
}
export class PublishPlace {
    static readonly type = '[Locations] Publish Place';
    constructor(public payload: { cityId: string, place: RequestPublishPlace }) { }
}
export class AddPlaceStory {
    static readonly type = '[Locations] New Place Story';
    constructor(public payload: { type: PlaceTabs, cityId: string, placeId: string, tale: NewPlaceTale }) { }
}
export class EditPlaceStory {
    static readonly type = '[Locations] Edit Place Story';
    constructor(public payload: { type: PlaceTabs, cityId: string, placeId: string, tale: TaleEdition }) { }
}
export class DeletePlaceStory {
    static readonly type = '[Locations] Delete Place Story';
    constructor(public payload: { type: PlaceTabs, cityId: string, placeId: string, taleId: string }) { }
}



