export class GetAllNpcs {
    static readonly type = '[Stories] Get All Npcs';
    constructor(public payload: { placeId: string, published: boolean, force?: boolean}) { }
}


// export class NewCity {
//     static readonly type = '[Stories] New City';
//     constructor(public payload: RequestNewCity) { }
// }
// export class PublishCity {
//     static readonly type = '[Stories] Publish City';
//     constructor(public payload: RequestPublishCity) { }
// }
// export class AddCityStory {
//     static readonly type = '[Stories] New City Story';
//     constructor(public payload: { type: CityTabs, cityId: string, tale: NewCityTale }) { }
// }
// export class EditCityStory {
//     static readonly type = '[Stories] Edit City Story';
//     constructor(public payload: { type: CityTabs, cityId: string, tale: TaleEdition }) { }
// }
// export class DeleteCityStory {
//     static readonly type = '[Stories] Delete City Story';
//     constructor(public payload: { type: CityTabs, cityId: string, taleId: string }) { }
// }

// export class GetAllPlaces {
//     static readonly type = '[Stories] Get All Places';
//     constructor(public payload: {request: RequestGetPlaces, force?: boolean}) { }
// }
// export class NewPlace {
//     static readonly type = '[Stories] New Place';
//     constructor(public payload: RequestNewPlace) { }
// }
// export class PublishPlace {
//     static readonly type = '[Stories] Publish Place';
//     constructor(public payload: { cityId: string, place: RequestPublishPlace }) { }
// }
// export class AddPlaceStory {
//     static readonly type = '[Stories] New Place Story';
//     constructor(public payload: {type: PlaceTabs, cityId: string, placeId: string, tale: NewPlaceTale}) { }
// }
// export class EditPlaceStory {
//     static readonly type = '[Stories] Edit Place Story';
//     constructor(public payload: {type: PlaceTabs, cityId: string, placeId: string, tale: TaleEdition}) { }
// }
// export class DeletePlaceStory {
//     static readonly type = '[Stories] Delete Place Story';
//     constructor(public payload: {type: PlaceTabs, cityId: string, placeId: string, taleId: string}) { }
// }



