export class TaleModel {
    // tslint:disable-next-line:variable-name
    _id: string;
    tale: TaleFragment[];
    author: string;
    published: boolean;
    // tslint:disable-next-line:variable-name
    publish_date: Date;
    // tslint:disable-next-line:variable-name
    write_date: Date;     // Fecha de creacion
}

export class OptionModel {
    // tslint:disable-next-line:variable-name
    _id?: string;
    name: string;
    description: TaleFragment;
    value: string;                // id del capitulo al que apunta esa opcion
    published?: boolean;          // si el capitulo siguiente esta publicado o no
}

export class TaleFragment {
    text: string;
    animation?: string;
}

