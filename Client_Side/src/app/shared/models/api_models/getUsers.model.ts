import { environment } from 'src/environments/environment';


export const GetUserURL = environment.url + '/users/user';
export const GetUsersByIdURL = environment.url + '/users/user_by_id';

export class GetUserResponse {
    user?: UserResponse;
}
export class UserResponse {
    // tslint:disable-next-line:variable-name
    _id?: string;
    username?: string;
    password?: string;
    rol?: [string];
    characters?: string[];
}

export class GetUserRequest {
    username: string;
    password: string;
}
export class GetUserByIdRequest {
    id: string;
}

