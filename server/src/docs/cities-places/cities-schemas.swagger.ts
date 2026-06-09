export const citiesSchemas = {
  Place: {
    type: 'object',
    properties: {
      id: { type: 'string', example: '665ed5a1c3f4e567890bcdef' },
      name: { type: 'string', example: 'Kholinar' },
      published: { type: 'boolean', example: true },
      publishDate: { type: 'string', format: 'date-time', example: '2026-01-15T00:00:00.000Z' },
      events: {
        type: 'array',
        description: 'IDs de los NPCs vinculados a este lugar',
        items: { type: 'string', example: '665ed6b3c3f4e567890cdefa' }
      },
      description: {
        type: 'array',
        items: { $ref: '#/components/schemas/Tale' }
      },
      entry: {
        type: 'array',
        items: { $ref: '#/components/schemas/Tale' }
      }
    }
  },

  City: {
    type: 'object',
    properties: {
      id: { type: 'string', example: '665ed7c4c3f4e567890defab' },
      name: { type: 'string', example: 'Alethkar' },
      published: { type: 'boolean', example: false },
      publishDate: { type: 'string', format: 'date-time', nullable: true },
      description: {
        type: 'array',
        items: { $ref: '#/components/schemas/Tale' }
      },
      travel: {
        type: 'array',
        items: { $ref: '#/components/schemas/Tale' }
      },
      places: {
        type: 'array',
        items: { $ref: '#/components/schemas/Place' }
      },
      createdAt: { type: 'string', format: 'date-time' },
      updatedAt: { type: 'string', format: 'date-time' }
    }
  },
};