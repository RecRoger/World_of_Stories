import { TaleModel, OptionModel } from 'src/app/shared/models/client_models/commons.model';
import { ChapterModel } from 'src/app/shared/models/client_models/chapter.model';

export class NpcModel {
    // tslint:disable-next-line:variable-name
    _id: string;
    name?: string;		       // nombre aislado del personaje
    // tslint:disable-next-line:variable-name
    npc_type?: string; 		   // lugar de 'historias', 'tienda', 'posta de caballos' etc.
    description?: TaleModel; // descripciones del personaje, presentacion general, corta.
    meeting?: TaleModel;       // presentacion del personaje y su polemica, cierra en pregunta
    decision?: OptionModel[];
    rejected?: TaleModel;      // narracion de rechazo
    items?: string[];       // items del npc (tienda);
    title?: string;	       // Titulo de la historia
    chapters?: ChapterModel[];
    author?: string;
    published?: boolean;
    // tslint:disable-next-line:variable-name
    write_date?: Date;     // Fecha de creacion
    // tslint:disable-next-line:variable-name
    publish_date?: Date;
}
