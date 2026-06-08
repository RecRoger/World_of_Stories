import { JsonObject } from 'swagger-ui-express';
import { userSchemas } from './users/users-schemas.swagger.js';
import { citiesSchemas } from './cities-places/cities-schemas.swagger.js';
import { citiesPaths } from './cities-places/cities-path.swagger.js';
import { placesPaths } from './cities-places/places-path.swagger.js';
import { usersPaths } from './users/users-path.swagger.js';
import { commonSchemas } from './common-schemas.swagger.js';
// A medida que avances, importarás: cityPaths, bookPaths, etc.

const swaggerDocument: JsonObject = {
  openapi: '3.0.0',
  info: {
    title: 'World of Stories API',
    version: '1.0.0',
    description: 'Documentación limpia y modularizada'
  },
  servers: [
    { url: 'http://localhost:3000/api/v1' }
  ],
  // Fusionamos las rutas de todos los archivos individuales
  paths: {
    ...usersPaths,
    ...citiesPaths,
    ...placesPaths,
  },
  // Fusionamos los componentes/esquemas de la base de datos
  components: {
    schemas: {
      ...userSchemas,
      ...commonSchemas,
      ...citiesSchemas,
    }
  }
};

export default swaggerDocument;