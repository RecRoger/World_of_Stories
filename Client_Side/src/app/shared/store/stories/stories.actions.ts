import { RequestNewNpc, RequestPublishNpc, UpdateNpcStructure } from 'src/client-api';

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

// export class EditNpcStory {
//     static readonly type = '[Stories] Edit Npc Story';
//     constructor(public payload: { type: NpcTabs, NpcId: string, tale: TaleEdition }) { }
// }
// export class DeleteNpcStory {
//     static readonly type = '[Stories] Delete Npc Story';
//     constructor(public payload: { type: NpcTabs, NpcId: string, taleId: string }) { }
// }

// export class GetAllPlaces {
//     static readonly type = '[Stories] Get All Places';
//     constructor(public payload: {request: RequestGetPlaces, force?: boolean}) { }
// }
// export class NewPlace {
//     static readonly type = '[Stories] New Place';
//     constructor(public payload: RequestNewPlace) { }
// }
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



