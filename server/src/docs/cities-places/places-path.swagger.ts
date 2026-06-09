export const placesPaths = {
  '/places/city/{cityId}': {
    get: {
      tags: ['Places'],
      summary: 'Obtener todos los lugares de una ciudad (getCityPlaces)',
      description: 'Retorna los lugares que pertenecen a una ciudad específica. Soporta filtrado por el query param ?published=true.',
      parameters: [
        {
          name: 'cityId',
          in: 'path',
          required: true,
          description: 'ID de la ciudad a la que pertenecen los lugares',
          schema: { type: 'string', example: '665ed7c4c3f4e567890defab' }
        },
        {
          name: 'published',
          in: 'query',
          required: false,
          description: 'Filtrar lugares por estado de publicación (?published=true)',
          schema: { type: 'string', enum: ['true', 'false'] }
        }
      ],
      responses: {
        200: {
          description: 'Lista de lugares de la ciudad obtenida correctamente.',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  ok: { type: 'boolean', example: true },
                  count: { type: 'integer', example: 3 },
                  data: {
                    type: 'object',
                    properties: {
                      places: { type: 'array', items: { $ref: '#/components/schemas/Place' } }
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
    post: {
      tags: ['Places'],
      summary: 'Crear y guardar un nuevo lugar en una ciudad (savePlace)',
      description: 'Inserta un nuevo lugar dentro del array de lugares de la ciudad indicada.',
      parameters: [
        {
          name: 'cityId',
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
              required: ['name'],
              properties: {
                name: { type: 'string', example: 'Palacio de Elendel' },
                userName: { type: 'string', example: 'Palacio de Elendel' },
                description: { type: 'Object', $ref: '#/components/schemas/Readable' },
                entry: { type: 'Object', $ref: '#/components/schemas/Readable' }
              }
            }
          }
        }
      },
      responses: {
        201: {
          description: 'Lugar creado y guardado de forma exitosa.',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  ok: { type: 'boolean', example: true },
                  message: { type: 'string', example: 'Lugar guardado correctamente.' },
                  data: { $ref: '#/components/schemas/Place' }
                }
              }
            }
          }
        },
        404: { description: 'La ciudad especificada no existe.' }
      }
    }
  },
  '/places/{placeId}': {
    get: {
      tags: ['Places'],
      summary: 'Obtener detalle completo de un solo lugar (getOnePlace)',
      description: 'Busca en toda la base de datos y retorna un único lugar por su ID. Devuelve todos los campos desglosados (events como array de IDs, descriptions y entries formateados).',
      parameters: [
        {
          name: 'placeId',
          in: 'path',
          required: true,
          description: 'ID único del lugar a buscar',
          schema: { type: 'string', example: '665ed5a1c3f4e567890bcdef' }
        }
      ],
      responses: {
        200: {
          description: 'Detalle del lugar recuperado exitosamente.',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  ok: { type: 'boolean', example: true },
                  data: {
                    type: 'object',
                    properties: {
                      place: { $ref: '#/components/schemas/Place' }
                    }
                  }
                }
              }
            }
          }
        },
        404: { description: 'No se encontró el lugar especificado.' }
      }
    },
    delete: {
      tags: ['Places'],
      summary: 'Eliminar un lugar por completo (deletePlace)',
      description: 'Remueve de forma definitiva el subdocumento del lugar sin requerir el ID de la ciudad.',
      parameters: [
        {
          name: 'placeId',
          in: 'path',
          required: true,
          schema: { type: 'string' }
        }
      ],
      responses: {
        200: {
          description: 'Lugar eliminado correctamente.',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  ok: { type: 'boolean', example: true },
                  message: { type: 'string', example: 'Lugar eliminado correctamente.' }
                }
              }
            }
          }
        },
        404: { description: 'Lugar no encontrado.' }
      }
    }
  },
  '/places/{placeId}/publish': {
    patch: {
      tags: ['Places'],
      summary: 'Publicar o despublicar un lugar (publishPlace)',
      description: 'Modifica de manera parcial el estado de publicación y setea automáticamente el campo publishDate.',
      parameters: [
        {
          name: 'placeId',
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
          description: 'Estado de publicación alterado con éxito.'
        }
      }
    }
  },
  '/places/:placeId/description': {
    put: {
      tags: ['Places'],
      summary: 'Añadir un relato de descripción a un lugar (addPlaceDescription)',
      description: 'Inserta una nueva descripción en el array del lugar.',
      parameters: [{ name: 'placeId', in: 'path', required: true, schema: { type: 'string' } }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['tale', 'author'],
              properties: {
                tale: { type: 'Object', $ref: '#/components/schemas/Readable' },
                author: { type: 'string', example: 'Hoid' }
              }
            }
          }
        }
      },
      responses: {
        201: {
          description: 'Descripción guardada.',
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
    },
    patch: {
      tags: ['Places'],
      summary: 'Actualizar un relato de descripción específico (updatePlaceDescription)',
      description: 'Actualiza de forma atómica usando arrayFilters el relato interno del lugar.',
      parameters: [{ name: 'placeId', in: 'path', required: true, schema: { type: 'string' } }],
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
        200: { description: 'Descripción actualizada con éxito.' }
      }
    }
  },
  '/places/{placeId}/description/{taleId}': {
    delete: {
      tags: ['Places'],
      summary: 'Eliminar una descripción del lugar (removePlaceDescription)',
      parameters: [
        { name: 'placeId', in: 'path', required: true, schema: { type: 'string' } },
        { name: 'taleId', in: 'path', required: true, schema: { type: 'string' } }
      ],
      responses: {
        200: { description: 'Descripción removida del array satisfactoriamente.' }
      }
    }
  },

  // ------------------------------------------
  // Sub-CRUD: Cuentos de Entrada del Lugar (Places -> Entry)
  // ------------------------------------------
  '/places/:placeId/entry': {
    patch: {
      tags: ['Places'],
      summary: 'Añadir un cuento de entrada a un lugar (addPlaceEntry)',
      parameters: [{ name: 'placeId', in: 'path', required: true, schema: { type: 'string' } }],
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
          description: 'Entrada añadida.',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  ok: { type: 'boolean', example: true },
                  data: {
                    type: 'object',
                    properties: {
                      entry: { $ref: '#/components/schemas/Tale' }
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
      tags: ['Places'],
      summary: 'Actualizar un cuento de entrada específico (updatePlaceEntry)',
      parameters: [{ name: 'placeId', in: 'path', required: true, schema: { type: 'string' } }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['description'], // Sigue usando la propiedad destructurada en tu req.body
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
        200: { description: 'Cuento de entrada guardado correctamente.' }
      }
    }
  },

  '/places/{placeId}/entry/{taleId}': {
    delete: {
      tags: ['Places'],
      summary: 'Eliminar un cuento de entrada del lugar (removePlaceEntry)',
      parameters: [
        { name: 'placeId', in: 'path', required: true, schema: { type: 'string' } },
        { name: 'taleId', in: 'path', required: true, schema: { type: 'string' } }
      ],
      responses: {
        200: { description: 'Entrada del lugar eliminada con éxito.' }
      }
    }
  }
};