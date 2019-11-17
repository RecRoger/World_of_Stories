import { environment } from 'src/environments/environment';


export const AddUserRolURL = environment.url + '/users/update_rol';

export class AddUserRolResponse {
    n: number;
    nModified: number;
    ok: number;
}

export class AddUserRolRequest {
    id: string;
    rol: string;
}

