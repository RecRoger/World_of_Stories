import { environment } from 'src/environments/environment';
import { TaleUpdate } from 'src/app/shared/models/api_models/updateCity.model';


export const publishPlaceURL = environment.url + '/places/publish';
export class PublishPlaceRequest {
    id: string;
    published: boolean;
}

export const UpdatePlaceDescriptionURL = environment.url + '/places/update_desc';
export class UpdatePlaceDescriptionRequest {
    description?: TaleUpdate;
}

export const UpdatePlaceEntryURL = environment.url + '/places/update_entry';
export class UpdatePlaceEntryRequest {
    entry?: TaleUpdate;
}

export const addPlaceDescriptionURL = environment.url + '/places/add_desc';
export const addPlaceEntryURL = environment.url + '/places/add_entry';
export class AddPlaceTaleRequest {
    id: string;
    tale: string;
    author: string;
}

export const removePlaceDescriptionURL = environment.url + '/cities/remove_desc';
export const removePlaceEntryURL = environment.url + '/cities/remove_travel';
export class RemovePlaceTaleRequest {
    id: string;
}


