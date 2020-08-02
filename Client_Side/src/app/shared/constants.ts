import { ReadFragment } from 'wos-api';

export enum UsersRoles {
    W = 'Writer',
    R = 'Reader',
    A = 'Admin'
}

export enum CityTabs {
    descripcion = 'desc',
    travel = 'travel',
}
export enum PlaceTabs {
    descripcion = 'desc',
    entry = 'entry',
}
export enum NpcTabs {
    descripcion = 'desc',
    meeting = 'meet',
    decision = 'decision',
    reject = 'reject',
}

export enum AnimationsTypes {
    default = 'default',
    chatA = 'chatA',
    chatB = 'chatB',
    title = 'title'
}
export enum ReaderTabs {
    start = 'start',
    city = 'city',
    place = 'place',
    npc = 'npc',
    story = 'story'
}
