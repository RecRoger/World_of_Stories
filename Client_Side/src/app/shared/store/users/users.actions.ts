import { UserModel } from '../../models/client_models/user.model';
import { RequestLogin, RequestSignin, RequestSetRol } from 'src/client-api/model/models';
// import { RequestSignin, RequestLogin, RequestSetRol } from 'src/client-api';

export class LogonUser {
    static readonly type = '[User] Logon User';
    constructor() { }
}

export class LoginUser {
    static readonly type = '[User] Login User';
    constructor(public payload: RequestLogin) { }
}

export class SigninUser {
    static readonly type = '[User] Signin User';
    constructor(public payload: RequestSignin) { }
}

export class AddUserRoll {
    static readonly type = '[User] Add User Roll';
    constructor(public payload: RequestSetRol) { }
}

export class UpdateUserData {
    static readonly type = '[User] Update User Data';
    constructor() { }
}


