export const commonSchemas = {
  Readable: {
    type: 'object',
    properties: {
      text: { type: 'string', example: 'El aire soplaba frío sobre las llanuras quebradas...' },
      animation: { type: 'string', example: 'fade-in-slow' }
    }
  },
  Tale: {
    type: 'object',
    properties: {
      id: { type: 'string', example: '665ed1b2c3f4e567890abcde' },
      tale: {
        type: 'array',
        items: { $ref: '#/components/schemas/Readable' }
      },
      author: { type: 'string', example: 'Hoid' },
      published: { type: 'boolean', example: false },
      writeDate: { type: 'string', format: 'date-time', example: '2026-06-08T16:24:00.000Z' },
      publishDate: { type: 'string', format: 'date-time', nullable: true, example: null }
    }
  },
};