import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector, Store } from '@ngxs/store';
import { SetLoader, SetError, SetInfo } from '../general/general.actions';

import { patch, append, updateItem, removeItem } from '@ngxs/store/operators';
import { Npc, RequestGetNpcs, StoriesService } from 'src/client-api';
import { GetAllNpcs } from './stories.actions';

export interface StoriesStateModel {
    places: {
        [placeId: string]: Npc[];
    };
}

@State<StoriesStateModel>({
    name: 'stories',
    defaults: {
        places: {}
    }
})
@Injectable()
export class StoriesState {

    constructor(private store: Store, private storiesService: StoriesService) {

    }

    @Selector()
    static getNpcs(state: StoriesStateModel) {
        return (placeId: string): Npc[] => {
            return state.places[placeId];
        };
    }



    @Action(GetAllNpcs)
    async GetAllNpcs(ctx: StateContext<StoriesStateModel>, action: GetAllNpcs) {

        try {

            const { placeId, published, force } = action.payload;

            if (!ctx.getState().places[placeId] || ctx.getState().places[placeId].length === 0 || action.payload.force) {


                const req: RequestGetNpcs = {
                    published: action.payload.published,
                    placeId
                };

                const resp = await this.storiesService.getNpcs(req).toPromise();

                if (resp && resp.data && resp.data.npcs) {
                    ctx.setState(patch({
                        places: patch({
                            [placeId]: resp.data.npcs
                        })
                    }));

                } else {
                    this.store.dispatch(new SetError('No hay eventos en el sistema'));
                    return false;
                }

            }

        } catch (err) {
            console.log('*** ERROR ***', err);

            this.store.dispatch(new SetError('Ha ocurrido un problema consultando los eventos. Intente mas tarde'));
            return false;
        }
    }



}
