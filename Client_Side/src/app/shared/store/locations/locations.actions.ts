import { RequestNewCity, RequestPublishCity, TaleEdition, NewCityTale, RequestGetPlaces } from 'src/client-api';
import { CityTabs } from '../../constants';

export class GetAllCities {
    static readonly type = '[Locations] Get All Cities';
    constructor(public payload?: boolean) { }
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
    constructor(public payload: {type: CityTabs, cityId: string, tale: NewCityTale}) { }
}
export class EditCityStory {
    static readonly type = '[Locations] Edit City Story';
    constructor(public payload: {type: CityTabs, cityId: string, tale: TaleEdition}) { }
}
export class DeleteCityStory {
    static readonly type = '[Locations] Delete City Story';
    constructor(public payload: {type: CityTabs, cityId: string, taleId: string}) { }
}

export class GetAllPlaces {
    static readonly type = '[Locations] Get All Places';
    constructor(public payload: RequestGetPlaces) { }
}
// export class NewCity {
//     static readonly type = '[Locations] New City';
//     constructor(public payload: RequestNewCity) { }
// }
// export class PublishCity {
//     static readonly type = '[Locations] Publish City';
//     constructor(public payload: RequestPublishCity) { }
// }
// export class AddCityStory {
//     static readonly type = '[Locations] New City Story';
//     constructor(public payload: {type: CityTabs, cityId: string, tale: NewCityTale}) { }
// }
// export class EditCityStory {
//     static readonly type = '[Locations] Edit City Story';
//     constructor(public payload: {type: CityTabs, cityId: string, tale: TaleEdition}) { }
// }
// export class DeleteCityStory {
//     static readonly type = '[Locations] Delete City Story';
//     constructor(public payload: {type: CityTabs, cityId: string, taleId: string}) { }
// }



