import { JsonObject } from 'swagger-ui-express';
import { userSchemas } from './users/users-schemas.swagger.js';
import { userPaths } from './users/users-path.swagger.js';
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
    ...userPaths,
    // ...cityPaths,
  },
  // Fusionamos los componentes/esquemas de la base de datos
  components: {
    schemas: {
      ...userSchemas,
      // ...citySchemas
    }
  }
};

export default swaggerDocument;