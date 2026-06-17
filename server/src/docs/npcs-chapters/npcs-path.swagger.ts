// npcs-chapters/npcs-path.swagger.ts

export const npcsPaths = {
  '/npcs/place/{placeId}': {
    get: {
      operationId: 'getPlaceNpcs',
      tags: ['NPCs'],
      summary: 'Obtener todos los NPCs de un lugar',
      parameters: [
        { name: 'placeId', in: 'path', required: true, schema: { type: 'string' }, description: 'ID del lugar geográfico' },
        { name: 'published', in: 'query', required: false, schema: { type: 'boolean' }, description: 'Filtrar por estado de publicación (?published=true)' }
      ],
      responses: {
        200: {
          description: 'Listado de NPCs obtenido con éxito',
          content: { 'application/json': { schema: { type: 'object', properties: { ok: { type: 'boolean', example: true }, data: { type: 'object', properties: { npcs: { type: 'array', items: { $ref: '#/components/schemas/Npc' } } } } } } } }
        },
        404: { description: 'No se encontró la ciudad o el lugar especificado.' }
      }
    },
    post: {
      operationId: 'createNpc',
      tags: ['NPCs'],
      summary: 'Crear un nuevo NPC y asociarlo al lugar',
      parameters: [{ name: 'placeId', in: 'path', required: true, schema: { type: 'string' } }],
      requestBody: {
        required: true,
        content: { 'application/json': { schema: { type: 'object', properties: { npc: { type: 'object', required: ['name', 'author'], properties: { name: { type: 'string' }, title: { type: 'string' }, npcType: { type: 'string' }, description: { type: 'string' }, meeting: { type: 'string' }, rejected: { type: 'string' }, author: { type: 'string' } } } } } } }
      },
      responses: {
        201: { description: 'NPC creado y vinculado exitosamente' },
        400: { description: 'Faltan los datos del NPC en el cuerpo de la petición.' },
        404: { description: 'No se pudo asociar el NPC porque el lugar no existe.' }
      }
    }
  },
  '/npcs/{id}': {
    get: {
      operationId: 'getNpc',
      tags: ['NPCs'],
      summary: 'Obtener un NPC por ID',
      parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
      responses: {
        200: { description: 'Detalle del NPC devuelto con éxito' },
        404: { description: 'NPC no encontrado o no publicado.' }
      }
    },
    put: {
      operationId: 'updateNpc',
      tags: ['NPCs'],
      summary: 'Actualizar propiedades de un NPC',
      parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
      requestBody: {
        required: true,
        content: {
          'application/json': { schema: { type: 'object', properties: { npc: { type: 'object', properties: { name: { type: 'string' }, title: { type: 'string' }, items: { type: 'array', items: { type: 'string' } } } } } } }
        },
        responses: {
          200: { description: 'NPC modificado de forma exitosa' },
          404: { description: 'No se encontró el NPC para actualizar.' }
        }
      }
    },
    delete: {
      operationId: 'deleteNpc',
      tags: ['NPCs'],
      summary: 'Eliminar un NPC de forma global',
      description: 'Borra el NPC y remueve automáticamente su ID de cualquier lista de eventos asociados en ciudades.',
      parameters: [{ name: 'npcId', in: 'path', required: true, schema: { type: 'string' } }],
      responses: {
        200: { description: 'NPC eliminado y desvinculado de su lugar de origen correctamente.' },
        404: { description: 'El NPC que intentas eliminar no existe.' }
      }
    }
  },
  '/npcs/{id}/publish': {
    patch: {
      operationId: 'publishNpc',
      tags: ['NPCs'],
      summary: 'Publicar o despublicar un NPC de forma parcial',
      parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
      requestBody: {
        required: true,
        content: { 'application/json': { schema: { type: 'object', properties: { published: { type: 'boolean', example: true } } } } }
      },
      responses: {
        200: { description: 'Estado de publicación actualizado con éxito.' }
      }
    }
  }
}
