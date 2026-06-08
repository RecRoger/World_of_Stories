export const userSchemas = {
  User: {
    type: 'object',
    properties: {
      id: { type: 'string', example: '665ed8d5c3f4e567890efabc' },
      userName: { type: 'string', example: 'Kaladin31' },
      email: { type: 'string', format: 'email', example: 'kaladin@bridgefour.com' },
      role: { type: 'string', example: 'USER_ROLE' },
      fragmentsRead: {
        type: 'array',
        description: 'Historial de IDs de Tales ya leídos por el usuario',
        items: { type: 'string', example: '665ed1b2c3f4e567890abcde' }
      },
      google: { type: 'boolean', example: false },
      status: { type: 'boolean', example: true }
    }
  }
};