import { environment } from 'src/environments/environment';
import { UserResponse } from 'src/app/shared/models/api_models/getUsers.model';


export const AddUsersURL = environment.url + '/users/add';

export class AddUserResponse {
    user?: UserResponse;
}

export class AddUserRequest {
    username: string;
    password: string;
}

