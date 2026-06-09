// npcs-chapters/chapters-path.swagger.ts

export const chaptersPaths = {
  '/chapters/npc/{npcId}': {
    get: {
      tags: ['Chapters'],
      summary: 'Obtener el listado simplificado de capítulos de un NPC',
      parameters: [
        { name: 'npcId', in: 'path', required: true, schema: { type: 'string' }, description: 'ID del NPC dueño de la historia' },
        { name: 'published', in: 'query', required: false, schema: { type: 'boolean' }, description: 'Filtrar por estado publicado' }
      ],
      responses: {
        200: {
          description: 'Estructura de capítulos obtenida',
          content: {
            'application/json': { schema: { type: 'object', properties: { ok: { type: 'boolean', example: true }, data: { type: 'object', properties: { chapters: { type: 'array', items: { type: 'object', properties: { id: { type: 'string' }, name: { type: 'string' }, published: { type: 'boolean' } } } } } } } } }
          },
          404: { description: 'No se encontró el NPC especificado.' }
        }
      }
    },
  },
  '/chapters/{id}': {
    get: {
      tags: ['Chapters'],
      summary: 'Obtener el detalle profundo de un capítulo por su ID propio',
      parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'ID único del capítulo' }],
      responses: {
        200: { description: 'Datos del capítulo (incluyendo opciones e IDs de grafo)', content: { 'application/json': { schema: { type: 'object', properties: { ok: { type: 'boolean' }, data: { type: 'object', properties: { chapter: { $ref: '#/components/schemas/Chapter' } } } } } } } },
        404: { description: 'Capítulo no encontrado dentro del árbol del NPC.' }
      }
    },
    put: {
      tags: ['Chapters'],
      summary: 'Actualizar un capítulo o inyectar nuevas decisiones en caliente',
      description: 'Permite modificar la narración de la historia. Si envías opciones dentro de `usersDecisions.options` sin propiedad `value`, el sistema creará pre-capítulos hijos de forma dinámica en la base de datos.',
      parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                chapter: {
                  type: 'object',
                  properties: {
                    name: { type: 'string' },
                    story: { type: 'array', items: { type: 'string' } },
                    author: { type: 'string' },
                    usersDecisions: { $ref: '#/components/schemas/UsersDecisions' }
                  }
                }
              }
            }
          }
        }
      },
      responses: {
        200: { description: 'Capítulo y ramificaciones modificados correctamente.' },
        404: { description: 'No se encontró el capítulo solicitado para actualizar.' }
      }
    },
    delete: {
      tags: ['Chapters'],
      summary: 'Eliminar un capítulo y limpiar referencias de decisiones huérfanas',
      description: 'Elimina el subdocumento del capítulo y ejecuta una limpieza atómica en cascada quitando cualquier opción de otros capítulos que apuntara a este ID.',
      parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
      responses: {
        200: { description: 'Capítulo eliminado y referencias desvinculadas con éxito.' },
        404: { description: 'El capítulo no existía o no pudo ser desvinculado.' }
      }
    }
  },
  '/chapters/{id}/publish': {
    patch: {
      tags: ['Chapters'],
      summary: 'Publicar o despublicar un capítulo y sincronizar visibilidad en el grafo',
      parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
      requestBody: {
        required: true,
        content: { 'application/json': { schema: { type: 'object', properties: { published: { type: 'boolean', example: true } } } } }
      },
      responses: {
        200: { description: 'Estado de visibilidad del capítulo y sus enlaces sincronizado con éxito.' },
        404: { description: 'Capítulo no encontrado para publicar.' }
      }
    }
  }
};