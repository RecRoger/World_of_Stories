import { UserModel } from '../../models/client_models/user.model';
import { GetUserRequest } from '../../models/api_models/getUsers.model';
import { AddUserRequest } from '../../models/api_models/addUser.model';
import { AddUserRolRequest } from '../../models/api_models/addUserRol.model';

export class LogonUser {
    static readonly type = '[User] Logon User';
    constructor() { }
}

export class LoginUser {
    static readonly type = '[User] Login User';
    constructor(public payload: GetUserRequest) { }
}

export class SigninUser {
    static readonly type = '[User] Signin User';
    constructor(public payload: AddUserRequest) { }
}

export class AddUserRoll {
    static readonly type = '[User] Add User Roll';
    constructor(public payload: AddUserRolRequest) { }
}

export class UpdateUserData {
    static readonly type = '[User] Update User Data';
    constructor() { }
}


