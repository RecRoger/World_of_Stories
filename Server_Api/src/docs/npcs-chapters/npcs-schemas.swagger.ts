// npcs-chapters/npcs-schemas.swagger.ts

export const npcsSchemas = {
  DecisionOption: {
    type: 'object',
    properties: {
      id: { type: 'string', example: '65aef342b...' },
      name: { type: 'string', example: 'Desafiar al guardia' },
      description: { type: 'string', example: 'Intentas pasar por la fuerza usando intimidación.' },
      value: { type: 'string', description: 'ID del capítulo al que redirige esta opción', example: '65aef999c...' },
      published: { type: 'boolean', example: true },
      removeItem: { type: 'boolean', example: false }
    }
  },
  UsersDecisions: {
    type: 'object',
    properties: {
      decisionType: { type: 'string', enum: ['choose', 'item', 'amount'], example: 'choose' },
      amount: { type: 'number', example: 0 },
      item: { type: 'string', example: '' },
      options: {
        type: 'array',
        items: { $ref: '#/components/schemas/DecisionOption' }
      }
    }
  },
  Chapter: {
    type: 'object',
    properties: {
      id: { type: 'string', example: '65aef999c...' },
      name: { type: 'string', example: 'El Callejón del Mendigo' },
      story: {
        type: 'array',
        items: { type: 'string' },
        example: ['Te adentrás en la oscuridad.', 'Un hombre te observa desde las sombras.']
      },
      endLocation: {
        type: 'object',
        properties: {
          endChapter: { type: 'boolean', example: true }
        }
      },
      published: { type: 'boolean', example: false },
      author: { type: 'string', example: 'Roje' },
      writeDate: { type: 'string', format: 'date-time', example: '2026-06-08T17:30:00.000Z' },
      publishDate: { type: 'string', format: 'date-time', nullable: true, example: null }
    }
  },
  Npc: {
    type: 'object',
    properties: {
      id: { type: 'string', example: '65aef111a...' },
      name: { type: 'string', example: 'Hoid' },
      title: { type: 'string', example: 'El Sagaz' },
      npcType: { type: 'string', example: 'Storyteller' },
      description: { $ref: '#/components/schemas/Tale' },
      meeting: { $ref: '#/components/schemas/Tale' },
      rejected: { $ref: '#/components/schemas/Tale' },
      decision: { $ref: '#/components/schemas/UsersDecisions' },
      items: { type: 'array', items: { type: 'string' }, example: ['Flauta de Madera'] },
      author: { type: 'string', example: 'Roje' },
      published: { type: 'boolean', example: false },
      writeDate: { type: 'string', format: 'date-time' }
    }
  }
};