"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function castId(mainDocument) {
    if (Object.keys(mainDocument).length > 0) {
        const properties = Object.keys(mainDocument);
        if (properties.includes("_id")) {
            mainDocument.id = mainDocument._id;
        }
        properties.forEach(key => {
            if (Object.keys(mainDocument[key]).length > 0) {
                const subproperties = Object.keys(mainDocument[key]);
                if (subproperties.includes("_id")) {
                    mainDocument[key].id = mainDocument[key]._id;
                }
            }
        });
    }
    else {
    }
    return mainDocument;
}
exports.castId = castId;
