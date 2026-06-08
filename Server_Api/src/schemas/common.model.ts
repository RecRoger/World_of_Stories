export interface chapterLocation {
    endChapter?: boolean,
    cityId?: string,    // place or city
    placeId?: string       // id del lugar de retorno del capiulo

}
export interface decisionObject {
    decisionType: string;               // tipo de la decision: 'choose', 'item', 'money'
    amount?: number;            // money amount para el cuento   
    item?: string;              // item necesario para el cuento
    options: decisionOption[];    // desisiones 
}
export interface decisionOption {
    _id?: string
    name: string                 // eso no se por que lo cree
    description: string    // opcion seleccionable
    value: string                // id del capitulo al que apunta esa opcion
    published?: boolean          // si el capitulo siguiente esta publicado o no
    removeItem?: boolean;       // flag para remover el item o dinero
}

