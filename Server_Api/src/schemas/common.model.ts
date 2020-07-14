export interface publicTale {
    _id:string
    tale: readFragment[];        // Narrativa
    author:string;       // nombre del autor
    published:boolean;   // Estado de publicacion
    write_date:Date;     // Fecha de creacion
    publish_date:Date;   // Fecha de publicacion
}
export interface readFragment{
    text: string;
    animation?: string;
}

export interface decisionOption{
    _id?:string
    name:string                 // eso no se por que lo cree
    description:string          // opcion seleccionable
    value:string                // id del capitulo al que apunta esa opcion
    published?:boolean          // si el capitulo siguiente esta publicado o no
}

