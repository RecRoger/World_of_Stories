import { environment } from 'src/environments/environment';
import { TaleFragment } from '../client_models/commons.model';


export const AddCityURL = environment.url + '/cities/add';

export class AddCityResponse {
    city: any;
}

export class AddCityRequest {
    userid?: string;
    name?: string;
    description?: TaleFragment[];
    travel?: TaleFragment[];
}

