import { TaleModel } from 'src/app/shared/models/client_models/commons.model';

export class CityModel {
    // tslint:disable-next-line:variable-name
    _id?: string;
    name?: string;
    description?: TaleModel[];
    travel?: TaleModel[];
    published?: boolean;
    // tslint:disable-next-line:variable-name
    publish_date?: Date;
}
