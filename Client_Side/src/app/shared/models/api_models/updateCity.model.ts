import { environment } from 'src/environments/environment';
import { TaleFragment } from '../client_models/commons.model';


export const publishCityURL = environment.url + '/cities/publish';
export class PublishCityRequest {
    id: string;
    published: boolean;
}

export const updateCityDescriptionURL = environment.url + '/cities/update_desc';
export class UpdateCityDescriptionRequest {
    description?: TaleUpdate;
}

export const updateCityTravelURL = environment.url + '/cities/update_travel';
export class UpdateCityTravelRequest {
    travel?: TaleUpdate;
}

export const addCityDescriptionURL = environment.url + '/cities/add_desc';
export const addCityTravelURL = environment.url + '/cities/add_travel';
export class AddCityTaleRequest {
    id: string;
    tale: TaleFragment[];
    author: string;
}

export const removeCityDescriptionURL = environment.url + '/cities/remove_desc';
export const removeCityTravelURL = environment.url + '/cities/remove_travel';
export class RemoveCityTaleRequest {
    id: string;
}






export class UpdateResponse {
    n: number;
    nModified: number;
    ok: number;
}

export class TaleUpdate {
    id?: string;
    tale?: TaleFragment[];
    author?: string;
    published?: boolean;
}


