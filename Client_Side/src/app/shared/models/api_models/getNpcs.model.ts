import { environment } from 'src/environments/environment';
import { NpcModel } from '../client_models/npc.model';


export const getPlaceNPCsURL = environment.url + '/npcs/npcs';

export class GetPlaceNpcsResponse {
    npcs: NpcModel[];
}

export class GetPlaceNpcsRequest {
    ids: string[];
    published?: boolean;
}

