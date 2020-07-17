export class SetLoader {
    static readonly type = '[General] Set Loader';
    constructor(public payload: boolean) { }
}
export class SetError {
    static readonly type = '[General] Set Error';
    constructor(public payload: string) { }
}
export class SetInfo {
    static readonly type = '[General] Set Info';
    constructor(public payload: string) { }
}
