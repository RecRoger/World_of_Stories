import { environment } from 'src/environments/environment';

export const AddPlaceURL = environment.url + '/places/add';

export class AddPlaceResponse {
    place: any;
}

export class AddPlaceRequest {
    id: string;
    userid: string;
    name: string;
    description: string;
    entry: string;
}

