import { RequestLogin, RequestSignin, RequestSetRol, User, RequestNewCharacter, RequestDeleteCharacter } from 'src/client-api/model/models';
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
    constructor(public payload?: User) { }
}

export class GetCharacters {
    static readonly type = '[User] Get Users Characters';
    constructor() { }
}

export class NewCharacter {
    static readonly type = '[User] New Character';
    constructor(public payload: RequestNewCharacter) { }

}
export class DeleteCharacter {
    static readonly type = '[User] Delete Character';
    constructor(public payload: RequestDeleteCharacter) { }
}


