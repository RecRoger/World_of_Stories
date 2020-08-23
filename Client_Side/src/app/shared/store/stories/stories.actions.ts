import { RequestNewNpc, RequestPublishNpc, UpdateNpcStructure, RequestGetChapters, RequestUpdateChapter, RequestPublishChapter, Chapter } from 'wos-api';
import { ChapterDividerModel } from '../../components/animated-fragment/animated-fragment.component';

export class GetAllNpcs {
    static readonly type = '[Stories] Get All Npcs';
    constructor(public payload: { placeId: string, published: boolean, force?: boolean }) { }
}
export class GetNpcData {
    static readonly type = '[Stories] Get Npc Data';
    constructor(public payload: { placeId: string, npcId: string, force?: boolean }) { }
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
export class GetChapterData {
    static readonly type = '[Stories] Get Chapter Data';
    constructor(public payload: { placeId: string, npcId: string, chapterId: string }) { }
}

export class UpdateChapter {
    static readonly type = '[Stories] Update Chapter';
    constructor(public payload: { placeId: string, npcId: string, request: RequestGetChapters, npc: RequestUpdateChapter }) { }
}
export class PublishChapter {
    static readonly type = '[Stories] Publish Chapter';
    constructor(public payload: { placeId: string, npcId: string, chapter: RequestPublishChapter }) { }
}

export class DivideChapter {
    static readonly type = '[Stories] Divide Chapter';
    constructor(public payload: { placeId: string, npcId: string, chapter: Chapter, division: ChapterDividerModel }) { }
}
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



