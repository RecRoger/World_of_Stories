export const userPaths = {
  '/users': {
    get: {
      summary: 'Obtener todos los usuarios',
      description: 'Retorna la lista de usuarios con personajes anidados.',
      responses: {
        200: { description: 'Éxito' }
      }
    }
  }
};