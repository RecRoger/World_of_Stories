import { environment } from 'src/environments/environment';
import { CityModel } from 'src/app/shared/models/client_models/city.model';


export const getAllCitiesURL = environment.url + '/cities/cities';

export class GetAllCitiesResponse {
    cities: CityModel[];
}

export class GetAllCitiesRequest {
    published?: boolean;
}

