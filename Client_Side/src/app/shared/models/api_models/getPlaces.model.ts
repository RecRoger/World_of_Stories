import { environment } from 'src/environments/environment';
import { PlaceModel } from 'src/app/shared/models/client_models/place.model';


export const getCityPlacesURL = environment.url + '/places/places';

export class GetCityPlacesResponse {
    places: PlaceModel[];
}

// export class PlaceResponse {
//     // tslint:disable-next-line:variable-name
//     _id?: string;
//     name?: string;
//     description?:
//         {
//             // tslint:disable-next-line:variable-name
//             _id: string;
//             tale: string;
//             author: string;
//             published: boolean
//             publish_date: Date;
//         }[];
//     entry?: {
//         // tslint:disable-next-line:variable-name
//         _id: string;
//         tale: string;
//         author: string;
//         published: boolean
//         publish_date: Date;
//     }[];
//     published?: boolean;
//     // tslint:disable-next-line:variable-name
//     publish_date: Date;
//     events?: string[];
// }


export class GetCityPlacesRequest {
    id: string;
    published?: boolean;
}

