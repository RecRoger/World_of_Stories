import { RequestNewNpc, RequestPublishNpc, UpdateNpcStructure, RequestGetChapters, RequestUpdateChapter } from 'src/client-api';

export class GetAllNpcs {
    static readonly type = '[Stories] Get All Npcs';
    constructor(public payload: { placeId: string, published: boolean, force?: boolean }) { }
}
export class NewNpc {
    static readonly type = '[Stories] New Npc';
    constructor(public payload: RequestNewNpc) { }
}

export class PublishNpc {
    static readonly type = '[Stories] Publish Npc';
    constructor(public payload: { placeId: string, req: RequestPublishNpc }) { }
}
export class UpdateNpc {
    static readonly type = '[Stories] Update Npc';
    constructor(public payload: { placeId: string, npcId: string, npc: UpdateNpcStructure }) { }
}

export class GetNpcStory {
    static readonly type = '[Stories] Get Npc Story';
    constructor(public payload: { placeId: string, npcId: string, request: RequestGetChapters }) { }
}

export class UpdateChapter {
    static readonly type = '[Stories] Update Chapter';
    constructor(public payload: { placeId: string, npcId: string, request: RequestGetChapters, npc: RequestUpdateChapter }) { }
}
// export class PublishPlace {
//     static readonly type = '[Stories] Publish Place';
//     constructor(public payload: { NpcId: string, place: RequestPublishPlace }) { }
// }
// export class AddPlaceStory {
//     static readonly type = '[Stories] New Place Story';
//     constructor(public payload: {type: PlaceTabs, NpcId: string, placeId: string, tale: NewPlaceTale}) { }
// }
// export class EditPlaceStory {
//     static readonly type = '[Stories] Edit Place Story';
//     constructor(public payload: {type: PlaceTabs, NpcId: string, placeId: string, tale: TaleEdition}) { }
// }
// export class DeletePlaceStory {
//     static readonly type = '[Stories] Delete Place Story';
//     constructor(public payload: {type: PlaceTabs, NpcId: string, placeId: string, taleId: string}) { }
// }



