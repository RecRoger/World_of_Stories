// src/docs/cities-path.swagger.ts

export const citiesPaths = {
  // ==========================================
  // 1. ENDPOINTS GLOBALES DE CITIES
  // ==========================================
  '/cities': {
    get: {
      tags: ['Cities'],
      summary: 'Obtener todas las ciudades (Listado Ligero)',
      description: 'Retorna todas las ciudades de la base de datos. Excluye automáticamente arrays pesados (description, travel, places) para optimizar el rendimiento de la red.',
      parameters: [
        {
          name: 'published',
          in: 'query',
          required: false,
          description: 'Filtrar por estado de publicación (?published=true o ?published=false)',
          schema: {
            type: 'string',
            enum: ['true', 'false']
          }
        }
      ],
      responses: {
        200: {
          description: 'Listado de ciudades obtenido correctamente.',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  ok: { type: 'boolean', example: true },
                  count: { type: 'integer', example: 5 },
                  data: {
                    type: 'object',
                    properties: {
                      cities: {
                        type: 'array',
                        items: { $ref: '#/components/schemas/City' }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        500: { description: 'Error interno del servidor.' }
      }
    },
    post: {
      tags: ['Cities'],
      summary: 'Crear una nueva ciudad',
      description: 'Registra una ciudad en la base de datos con validación de nombre único. Inicializa los relatos de descripción y viaje como borradores.',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['name', 'userName'],
              properties: {
                name: { type: 'string' },
                userName: { type: 'string' },
                description: { type: 'Object', $ref: '#/components/schemas/Readable' },
                travel: { type: 'Object', $ref: '#/components/schemas/Readable' }
              }
            }
          }
        }
      },
      responses: {
        201: {
          description: 'Ciudad creada exitosamente.',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  ok: { type: 'boolean', example: true },
                  message: { type: 'string', example: 'Ciudad creada exitosamente.' },
                  data: {
                    type: 'object',
                    properties: {
                      city: { $ref: '#/components/schemas/City' }
                    }
                  }
                }
              }
            }
          }
        },
        409: {
          description: 'Conflicto: El nombre de la ciudad ya se encuentra registrado.',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  ok: { type: 'boolean', example: false },
                  message: { type: 'string', example: 'La ciudad con el nombre "Luthadel" ya se encuentra registrada.' }
                }
              }
            }
          }
        },
        500: { description: 'Error al guardar la ciudad.' }
      }
    }
  },
  '/cities/{id}': {
    get: {
      tags: ['Cities'],
      summary: 'Obtener el detalle profundo de una ciudad',
      description: 'Recupera una ciudad completa por su ID con todos sus arrays hidratados (descriptions, travels, places). Actúa con los virtuals expuestos.',
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          description: 'ID único de MongoDB de la ciudad',
          schema: { type: 'string', example: '665ed7c4c3f4e567890defab' }
        }
      ],
      responses: {
        200: {
          description: 'Detalle de la ciudad recuperado con éxito.',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  ok: { type: 'boolean', example: true },
                  data: {
                    type: 'object',
                    properties: {
                      city: { $ref: '#/components/schemas/City' }
                    }
                  }
                }
              }
            }
          }
        },
        404: { description: 'No se encontró la ciudad especificada.' }
      }
    },
    delete: {
      tags: ['Cities'],
      summary: 'Eliminar una ciudad por completo',
      description: 'Remueve de forma permanente el documento de la ciudad y todos los subdocumentos anidados (relatos y lugares).',
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          description: 'ID de la ciudad a destruir',
          schema: { type: 'string' }
        }
      ],
      responses: {
        200: {
          description: 'Ciudad eliminada.',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  ok: { type: 'boolean', example: true },
                  message: { type: 'string', example: 'La ciudad "Luthadel" y todos sus relatos asociados fueron eliminados correctamente.' }
                }
              }
            }
          }
        },
        404: { description: 'No se encontró la ciudad para eliminar.' }
      }
    }
  },
  '/cities/{id}/publish': {
    patch: {
      tags: ['Cities'],
      summary: 'Cambiar estado de publicación de una ciudad',
      description: 'Publica o despublica una ciudad calculando de forma automática la fecha de publicación.',
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string' }
        }
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['published'],
              properties: {
                published: { type: 'boolean', example: true }
              }
            }
          }
        }
      },
      responses: {
        200: {
          description: 'Estado de publicación actualizado correctamente.',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  ok: { type: 'boolean', example: true },
                  message: { type: 'string', example: 'Ciudad publicada correctamente.' },
                  data: {
                    type: 'object',
                    properties: {
                      city: { $ref: '#/components/schemas/City' }
                    }
                  }
                }
              }
            }
          }
        },
        404: { description: 'Ciudad no encontrada.' }
      }
    }
  },
  '/cities/{cityId}/description': {
    patch: {
      tags: ['Cities'],
      summary: 'Añadir una descripción al array de la ciudad',
      parameters: [{ name: 'cityId', in: 'path', required: true, schema: { type: 'string' } }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['tale', 'author'],
              properties: {
                tale: { type: 'Object', $ref: '#/components/schemas/Readable' },
                author: { type: 'string', example: 'Sazed' }
              }
            }
          }
        }
      },
      responses: {
        201: {
          description: 'Relato añadido.',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  ok: { type: 'boolean', example: true },
                  message: { type: 'string', example: 'Descripción añadida correctamente a la ciudad.' },
                  data: {
                    type: 'object',
                    properties: {
                      description: { $ref: '#/components/schemas/Tale' }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    put: {
      tags: ['Cities'],
      summary: 'Actualizar un relato de descripción existente',
      parameters: [{ name: 'cityId', in: 'path', required: true, schema: { type: 'string' } }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['description'],
              properties: {
                description: {
                  type: 'object',
                  required: ['id', 'tale', 'published'],
                  properties: {
                    id: { type: 'string', example: '665ed1b2c3f4e567890abcde' },
                    tale: { type: 'Object', $ref: '#/components/schemas/Readable' },
                    published: { type: 'boolean', example: true }
                  }
                }
              }
            }
          }
        }
      },
      responses: {
        200: {
          description: 'Descripción actualizada de forma atómica.',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  ok: { type: 'boolean', example: true },
                  data: {
                    type: 'object',
                    properties: {
                      description: { $ref: '#/components/schemas/Tale' }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  },

  '/cities/{cityId}/description/{taleId}': {
    delete: {
      tags: ['Cities'],
      summary: 'Eliminar una descripción del array',
      parameters: [
        { name: 'cityId', in: 'path', required: true, schema: { type: 'string' } },
        { name: 'taleId', in: 'path', required: true, schema: { type: 'string' } }
      ],
      responses: {
        200: { description: 'Relato removido usando $pull.' }
      }
    }
  },

  '/cities/{cityId}/travel': {
    patch: {
      tags: ['Cities'],
      summary: 'Añadir un viaje al array de la ciudad',
      parameters: [{ name: 'cityId', in: 'path', required: true, schema: { type: 'string' } }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['tale', 'author'],
              properties: {
                tale: { type: 'Object', $ref: '#/components/schemas/Readable' },
                author: { type: 'string', example: 'Vin' }
              }
            }
          }
        }
      },
      responses: {
        201: {
          description: 'Viaje añadido con éxito.',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  ok: { type: 'boolean', example: true },
                  data: {
                    type: 'object',
                    properties: {
                      travel: { $ref: '#/components/schemas/Tale' }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    put: {
      tags: ['Cities'],
      summary: 'Actualizar un relato de viaje existente',
      parameters: [{ name: 'cityId', in: 'path', required: true, schema: { type: 'string' } }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['description'], // Mantenemos tu interfaz de req.body
              properties: {
                description: {
                  type: 'object',
                  required: ['id', 'tale', 'published'],
                  properties: {
                    id: { type: 'string', example: '665ed1b2c3f4e567890abcde' },
                    tale: { type: 'Object', $ref: '#/components/schemas/Readable' },
                    published: { type: 'boolean', example: false }
                  }
                }
              }
            }
          }
        }
      },
      responses: {
        200: {
          description: 'Viaje actualizado.',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  ok: { type: 'boolean', example: true },
                  data: {
                    type: 'object',
                    properties: {
                      travel: { $ref: '#/components/schemas/Tale' }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  },

  '/cities/{cityId}/travel/{taleId}': {
    delete: {
      tags: ['Cities'],
      summary: 'Eliminar un viaje del array',
      parameters: [
        { name: 'cityId', in: 'path', required: true, schema: { type: 'string' } },
        { name: 'taleId', in: 'path', required: true, schema: { type: 'string' } }
      ],
      responses: {
        200: { description: 'Relato de viaje eliminado.' }
      }
    }
  }
};