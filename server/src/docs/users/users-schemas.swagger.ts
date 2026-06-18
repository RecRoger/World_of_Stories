export const userSchemas = {
  Location: {
    type: 'object',
    description: 'Representa la ubicación exacta del personaje dentro del mapa interactivo',
    properties: {
      cityId: { type: 'string', nullable: true, example: '665ed7c4c3f4e567890defab' },
      placeId: { type: 'string', nullable: true, example: '665ed5a1c3f4e567890bcdef' },
      npcId: { type: 'string', nullable: true, example: '665edaa3c3f4e567890f1234' },
      chapterId: { type: 'string', nullable: true, example: '665edcc5c3f4e567890f5678' }
    }
  },
  Character: {
    type: 'object',
    description: 'Entidad de personaje que almacena el estado de la partida y el progreso individual',
    properties: {
      name: { type: 'string', example: 'Kaladin' },
      location: {
        $ref: '#/components/schemas/Location'
      },
      money: { type: 'number', example: 150 },
      items: {
        type: 'array',
        items: { type: 'string' },
        example: ['Lanza de entrenamiento', 'Frasco de esferas']
      },
      fragmentsRead: {
        type: 'array',
        description: 'IDs de relatos o fragmentos del Cosmere que este personaje específico ya leyó',
        items: { type: 'string' },
        example: ['665ed1b2c3f4e567890abcde']
      },
      animations: { type: 'boolean', example: true }
    }
  },
  User: {
    type: 'object',
    required: ['email', 'username', 'password'],
    properties: {
      _id: {
        type: 'string',
        description: 'ID nativo de MongoDB',
        example: '665ed8d5c3f4e567890efabc'
      },
      id: {
        type: 'string',
        description: 'ID casteado para compatibilidad en Frontend',
        example: '665ed8d5c3f4e567890efabc'
      },
      username: { type: 'string', example: 'kaladin31' },
      email: { type: 'string', format: 'email', example: 'kaladin@bridgefour.com' },
      password: { type: 'string', description: 'Hash encriptado', example: '$2b$10$X7rE8Y3M...' },
      role: {
        type: 'array',
        items: { type: 'string' },
        example: ['USER_ROLE']
      },
      characters: {
        type: 'array',
        nullable: true,
        items: { $ref: '#/components/schemas/Character' }
      },
      createdAt: { type: 'string', format: 'date-time', example: '2026-06-08T14:22:00.000Z' },
      updatedAt: { type: 'string', format: 'date-time', example: '2026-06-08T15:30:00.000Z' }
    }
  }
};