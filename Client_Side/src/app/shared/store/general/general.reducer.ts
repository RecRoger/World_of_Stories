import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { UserModel } from '../../models/client_models/user.model';
import { SetLoader, SetError } from './general.actions';
import { patch, append, removeItem, insertItem, updateItem } from '@ngxs/store/operators';

export interface MessageModel {
    type: 'error' | 'success' | 'info';
    text: string;
    time: Date;
}
export interface GeneralMessageStateModel {
    loadingStatus: number;
    errorMesage: MessageModel[];
}

@State<GeneralMessageStateModel>({
    name: 'general',
    defaults: {
        errorMesage: [],
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
    static errorAlerts(state: GeneralMessageStateModel): MessageModel {
        const errors = state.errorMesage.filter(msg => msg.type === 'error');
        return errors && errors.length > 0 && errors.splice(-1)[0];
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
        }
        ctx.setState(
            patch({
                errorMesage: append([message]),
            })
        );

    }


}
