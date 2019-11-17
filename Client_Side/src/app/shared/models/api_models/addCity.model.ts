import { environment } from 'src/environments/environment';


export const AddCityURL = environment.url + '/cities/add';

export class AddCityResponse {
    city: any;
}

export class AddCityRequest {
    userid: string;
    name: string;
    description: string;
    travel: string;
}

