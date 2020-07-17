import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { SetLoader, SetError, SetInfo } from './general.actions';
import { patch, append, removeItem, insertItem, updateItem } from '@ngxs/store/operators';

export interface MessageModel {
    type: 'error' | 'success' | 'info';
    text: string;
    time: Date;
}
export interface GeneralMessageStateModel {
    loadingStatus: number;
    alertMessages: MessageModel;
}

@State<GeneralMessageStateModel>({
    name: 'general',
    defaults: {
        alertMessages: null ,
        loadingStatus: 0
    }
})
@Injectable()
export class GeneralState {

    constructor() {

    }

    @Selector()
    static isLoading(state: GeneralMessageStateModel): number {
        return state.loadingStatus;
    }

    @Selector()
    static getAlerts(state: GeneralMessageStateModel): MessageModel {
        return state.alertMessages;
    }

    @Action(SetLoader)
    async SetLoader(ctx: StateContext<GeneralMessageStateModel>, action: SetLoader) {
        let loadCount = ctx.getState().loadingStatus;
        loadCount = (action.payload) ? +1 : -1;

        if (action.payload) {
            ctx.setState(patch({
                loadingStatus: loadCount
            }));
        } else {
            setTimeout(() => {
                ctx.setState(patch({
                    loadingStatus: loadCount
                }));
            }, 5000);
        }

    }

    @Action(SetError)
    async SetError(ctx: StateContext<GeneralMessageStateModel>, action: SetError) {

        const message: MessageModel = {
            time: new Date(),
            text: action.payload,
            type: 'error'
        };
        ctx.setState(
            patch({
                alertMessages: message,
            })
        );

    }

    @Action(SetInfo)
    async SetInfo(ctx: StateContext<GeneralMessageStateModel>, action: SetInfo) {

        const message: MessageModel = {
            time: new Date(),
            text: action.payload,
            type: 'info'
        };
        ctx.setState(
            patch({
                alertMessages: message,
            })
        );

    }


}
