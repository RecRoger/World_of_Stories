import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector, Store } from '@ngxs/store';
import { SetLoader, SetError, SetInfo } from '../general/general.actions';

import { patch, append, updateItem, removeItem } from '@ngxs/store/operators';
import {
    Npc,
    RequestGetNpcs,
    StoriesService,
    RequestNewCity,
    RequestNewNpc,
    RequestPublishNpc,
    RequestUpdateNpc,
    RequestGetChapters,
    Chapter,
    RequestGetNpc,
    RequestGetChapter,
    RequestUpdateChapter
} from 'wos-api';
import { GetAllNpcs, NewNpc, PublishNpc, UpdateNpc, GetNpcStory, UpdateChapter, PublishChapter, GetNpcData, GetChapterData, DivideChapter } from './stories.actions';

export interface StoriesStateModel {
    [placeId: string]: Npc[];
}

@State<StoriesStateModel>({
    name: 'stories',
    defaults: {

    }
})
@Injectable()
export class StoriesState {

    constructor(private store: Store, private storiesService: StoriesService) {

    }

    @Selector()
    static getNpcs(state: StoriesStateModel) {
        return (placeId: string): Npc[] => {
            return state[placeId] || [];
        };
    }
    @Selector()
    static getStory(state: StoriesStateModel) {
        return (placeId: string, npcId: string): Chapter[] => {
            if (placeId && npcId) {
                return state[placeId].find(n => n.id === npcId).chapters;
            } else {
                return [];
            }
        };
    }



    @Action(GetAllNpcs)
    async GetAllNpcs(ctx: StateContext<StoriesStateModel>, action: GetAllNpcs) {

        try {

            const { placeId, published, force } = action.payload;

            if (!ctx.getState()[placeId] || ctx.getState()[placeId].length === 0 || action.payload.force) {


                const req: RequestGetNpcs = {
                    published: action.payload.published,
                    placeId
                };

                const resp = await this.storiesService.getNpcs(req).toPromise();

                if (resp && resp.data && resp.data.npcs) {
                    ctx.setState(patch({
                        [placeId]: resp.data.npcs
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

    @Action(GetNpcData)
    async GetNpcData(ctx: StateContext<StoriesStateModel>, action: GetNpcData) {

        try {

            const { placeId, npcId, force } = action.payload;

            const place = ctx.getState()[placeId];
            const npc = place && place.find(n => n.id === npcId);

            if (!npc || !npc.decision || !npc.description || !npc.rejected || !npc.meeting || action.payload.force) {


                const req: RequestGetNpc = {
                    id: npcId
                };

                const resp = await this.storiesService.getNpc(req).toPromise();

                if (resp && resp.data && resp.data.npc) {
                    ctx.setState(patch({
                        [placeId]: updateItem<Npc>(n => n.id === npcId, patch({ ...resp.data.npc }))
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

    @Action(NewNpc)
    async NewNpc(ctx: StateContext<StoriesStateModel>, action: NewNpc) {

        try {

            const { placeId, npc } = action.payload;

            const req: RequestNewNpc = action.payload;

            const resp = await this.storiesService.newNpc(req).toPromise();

            if (resp && resp.data && resp.data.npc) {
                ctx.setState(patch({
                    [placeId]: append([resp.data.npc])
                }));

            } else {
                this.store.dispatch(new SetError('No hay eventos en el sistema'));
                return false;
            }


        } catch (err) {
            console.log('*** ERROR ***', err);

            this.store.dispatch(new SetError('Ha ocurrido un problema creando el eventos. Intente mas tarde'));
            return false;
        }
    }

    @Action(PublishNpc)
    async PublishNpc(ctx: StateContext<StoriesStateModel>, action: PublishNpc) {

        try {

            const { placeId, req } = action.payload;

            const resp = await this.storiesService.publishNpc(req).toPromise();

            if (resp && resp.data && resp.data === 'OK') {
                ctx.setState(
                    patch({
                        [placeId]: updateItem<Npc>(n => n.id === req.id, patch<Npc>({
                            published: req.published,
                            publishDate: req.published ? new Date().toDateString() : null,
                        })
                        )
                    })
                );

            } else {
                this.store.dispatch(new SetError('No se ha guardado la nueva ciudad'));
                return false;
            }
        } catch (err) {
            console.log('*** ERROR ***', err);

            this.store.dispatch(new SetError('Ha ocurrido un problema Creando la ciudad. Intente mas tarde'));
            return false;
        }
    }


    @Action(UpdateNpc)
    async UpdateNpc(ctx: StateContext<StoriesStateModel>, action: UpdateNpc) {

        try {

            const { placeId, npcId, npc } = action.payload;
            const req: RequestUpdateNpc = {
                id: npcId,
                npc
            };

            const resp = await this.storiesService.updateNpc(req).toPromise();

            if (resp && resp.data && resp.data.npc) {
                ctx.setState(
                    patch({
                        [placeId]: updateItem<Npc>(n => n.id === req.id, patch<Npc>({
                            items: resp.data.npc.items,
                            decision: resp.data.npc.decision,
                            meeting: resp.data.npc.meeting,
                            rejected: resp.data.npc.rejected,
                            title: resp.data.npc.title
                        }))
                    })
                );

            } else {
                this.store.dispatch(new SetError('No se ha guardado el cambio'));
                return false;
            }
        } catch (err) {
            console.log('*** ERROR ***', err);

            this.store.dispatch(new SetError('Ha ocurrido un problema actualizando el evento. Intente mas tarde'));
            return false;
        }
    }


    @Action(GetNpcStory)
    async GetNpcStory(ctx: StateContext<StoriesStateModel>, action: GetNpcStory) {

        try {
            const { placeId, npcId, request } = action.payload;

            const resp = await this.storiesService.getChapters(request).toPromise();

            if (resp && resp.data && resp.data.chapters) {
                ctx.setState(patch({
                    [placeId]: updateItem<Npc>(n => n.id === npcId, patch<Npc>({
                        chapters: resp.data.chapters
                    }))
                }));

            } else {
                this.store.dispatch(new SetError('No hay eventos en el sistema'));
                return false;
            }


        } catch (err) {
            console.log('*** ERROR ***', err);

            this.store.dispatch(new SetError('Ha ocurrido un problema consultando los eventos. Intente mas tarde'));
            return false;
        }
    }

    @Action(GetChapterData)
    async GetChapterData(ctx: StateContext<StoriesStateModel>, action: GetChapterData) {

        try {
            const { placeId, npcId, chapterId } = action.payload;

            const npc = ctx.getState()[placeId].find(n => n.id === npcId);
            const chapter = npc.chapters && npc.chapters.find(c => c.id === chapterId);
            if (chapter && !chapter.story) {
                const req: RequestGetChapter = {
                    id: chapterId
                };
                const resp = await this.storiesService.getChapter(req).toPromise();
                if (resp && resp.data && resp.data.chapter) {
                    ctx.setState(patch({
                        [placeId]: updateItem<Npc>(n => n.id === npcId, patch<Npc>({
                            chapters: updateItem<Chapter>(c => c.id === chapterId, patch({ ...resp.data.chapter }))
                        }))
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

    @Action(UpdateChapter)
    async UpdateChapter(ctx: StateContext<StoriesStateModel>, action: UpdateChapter) {

        try {
            const request = action.payload.npc;

            const resp = await this.storiesService.updateChapter(request).toPromise();

            if (resp && resp.data && resp.data.chapter) {
                await ctx.dispatch(new GetNpcStory({ ...action.payload })).toPromise();

            } else {
                this.store.dispatch(new SetError('No hay eventos en el sistema'));
                return false;
            }


        } catch (err) {
            console.log('*** ERROR ***', err);

            this.store.dispatch(new SetError('Ha ocurrido un problema consultando los eventos. Intente mas tarde'));
            return false;
        }
    }


    @Action(PublishChapter)
    async PublishChapter(ctx: StateContext<StoriesStateModel>, action: PublishChapter) {

        try {
            const { chapter, npcId, placeId } = action.payload;

            const resp = await this.storiesService.publishChapter(chapter).toPromise();

            if (resp && resp.data && resp.data === 'OK') {
                ctx.setState(
                    patch({
                        [placeId]: updateItem<Npc>(c => c.id === npcId, patch<Npc>({
                            chapters: updateItem<Chapter>(p => p.id === chapter.id, patch<Chapter>({
                                published: chapter.published,
                                publishDate: chapter.published ? new Date().toDateString() : null,
                            }))
                        })
                        )
                    })
                );

            } else {
                this.store.dispatch(new SetError('No se ha podido publicar'));
                return false;
            }


        } catch (err) {
            console.log('*** ERROR ***', err);

            this.store.dispatch(new SetError('Ha ocurrido un problema consultando los eventos. Intente mas tarde'));
            return false;
        }
    }

    @Action(DivideChapter)
    async DivideChapter(ctx: StateContext<StoriesStateModel>, action: DivideChapter) {

        // TODO - aqui viene el beta
        try {

            const { chapter, npcId, placeId, division } = action.payload;

            division.decision.options = division.decision.options.map((op, i) => ({
                ...op,
                id: chapter.usersDecisions.options && chapter.usersDecisions.options[i] ? chapter.usersDecisions.options[i].id : '',
            }));

            const firstChapter: Chapter = {
                ...chapter,
                story: division.previousTales,
                usersDecisions: division.decision,
                endLocation: {
                    endChapter: false
                }
            };
            const nextChapter: Chapter = {
                ...chapter,
                id: '',
                story: division.nextTales,
                usersDecisions: {
                    ...chapter.usersDecisions,
                    options: chapter.usersDecisions.options.map(o => ({ ...o, id: '' }))
                },
                endLocation: chapter.endLocation
            };


            const request1: RequestUpdateChapter = {
                chapter: {
                    ...firstChapter
                }
            };
            const resp = await this.storiesService.updateChapter(request1).toPromise();

            if (resp && resp.data && resp.data.chapter) {

                const editedChapter = resp.data.chapter;
                const request2: RequestUpdateChapter = {
                    chapter: {
                        ...nextChapter,
                        id: editedChapter.usersDecisions.options[0].value,
                        name: editedChapter.usersDecisions.options[0].name
                    }
                };
                const resp2 = await this.storiesService.updateChapter(request2).toPromise();

                if (resp2 && resp2.data && resp2.data.chapter) {

                    await this.store.dispatch(new GetNpcStory({ npcId, placeId, request: { id: npcId } })).toPromise();
                    console.log('llego hasta aca?');

                } else {
                    this.store.dispatch(new SetError('No se han podido cargar el capitulo continuación'));
                    return false;
                }

            } else {
                this.store.dispatch(new SetError('No se han podido cargar los capitulos'));
                return false;
            }


        } catch (err) {
            console.log('*** ERROR ***', err);
            this.store.dispatch(new SetError('Ha ocurrido un dividiendo el capitulo. Intente mas tarde'));
            return false;
        }
    }





}
