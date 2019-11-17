import { TaleModel, OptionModel } from 'src/app/shared/models/client_models/commons.model';

export class ChapterModel {
    // tslint:disable-next-line:variable-name
    _id: string;
    name?: string;
    story?: string;	                // narracion previa a batalla o decision.
    usersDecisions?: OptionModel[];
    // tslint:disable-next-line:variable-name
    end_location?: {
        location_Type?: string;    // place or city
        location_id?: string;       // id del lugar de retorno del capiulo
    };
    // itemsDecisions?: decisionOption[],
    // considerar
    // tipo de batalla?: string		    // orda, medium, boss (algoritmo de creacion)
    // enemigo?: Enemy_Character         // enemigo de la batalla
    // defeat?: string		            // narracion de derrota en batalla.
    // tslint:disable-next-line:variable-name
    item?: string[];		                // Item en caso de victoria
    published?: boolean;
    author?: string;
    // tslint:disable-next-line:variable-name
    write_date?: Date;     // Fecha de creacion
    // tslint:disable-next-line:variable-name
    publish_date?: Date;   // Fecha de publicacion
}
