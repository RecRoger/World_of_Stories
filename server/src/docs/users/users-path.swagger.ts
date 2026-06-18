// src/docs/paths.swagger.ts

export const usersPaths = {
  '/users': {
    get: {
      operationId: 'getUsers',
      tags: ['Users'],
      summary: 'Obtener todos los usuarios (getAllUsers)',
      description: 'Retorna el listado completo de los usuarios registrados en el sistema.',
      responses: {
        200: {
          description: 'Lista de usuarios recuperada con éxito.',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  ok: { type: 'boolean', example: true },
                  data: {
                    type: 'object',
                    properties: {
                      users: {
                        type: 'array',
                        items: { $ref: '#/components/schemas/User' }
                      }
                    },
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
      operationId: 'createUser',
      tags: ['Users'],
      summary: 'Crear un nuevo usuario (saveUser)',
      description: 'Registra un usuario en la base de datos. Retorna un código 201 Created al completarse.',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['username', 'email', 'password'],
              properties: {
                email: { type: 'string', format: 'email', example: 'kaladin@bridgefour.com' },
                username: { type: 'string', format: 'text', example: 'kaladin' },
                password: { type: 'string', format: 'password', example: 'Radiant1234' }
              }
            }
          }
        }
      },
      responses: {
        201: {
          description: 'Usuario creado exitosamente.',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  ok: { type: 'boolean', example: true },
                  data: {
                    type: 'object',
                    properties: {
                      user: { $ref: '#/components/schemas/User' }
                    },
                  }
                }
              }
            }
          }
        },
        400: { description: 'Campos inválidos o faltantes.' },
        409: { description: 'El nombre de usuario o email ya existen.' }
      }
    }
  },
  '/users/login': {
    post: {
      operationId: 'login',
      tags: ['Users'],
      summary: 'Iniciar sesión (getOneUser)',
      description: 'Verifica las credenciales enviadas en el body por motivos de seguridad y retorna el usuario autenticado.',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['email', 'password'],
              properties: {
                username: { type: 'string', format: 'text', example: 'kaladin@bridgefour.com' },
                password: { type: 'string', format: 'password', example: 'Radiant1234' }
              }
            }
          }
        }
      },
      responses: {
        200: {
          description: 'Autenticación exitosa.',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  ok: { type: 'boolean', example: true },
                  data: {
                    type: 'object',
                    properties: {
                      user: { $ref: '#/components/schemas/User' }
                    },
                  }
                }
              }
            }
          }
        },
        400: { description: 'Contraseña incorrecta.' },
        404: { description: 'El usuario no existe.' }
      }
    }
  },

  // ==========================================
  // OPERACIONES POR ID: /users/:id
  // ==========================================
  '/users/{id}': {
    get: {
      operationId: 'getUser',
      tags: ['Users'],
      summary: 'Obtener usuario por ID (getUserById)',
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          description: 'ID único de MongoDB del usuario',
          schema: { type: 'string', example: '665ed8d5c3f4e567890efabc' }
        }
      ],
      responses: {
        200: {
          description: 'Usuario encontrado.',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  ok: { type: 'boolean', example: true },
                  data: {
                    type: 'object',
                    properties: {
                      user: { $ref: '#/components/schemas/User' }
                    },
                  }
                }
              }
            }
          }
        },
        404: { description: 'Usuario no encontrado.' }
      }
    },
    put: {
      operationId: 'updateUser',
      tags: ['Users'],
      summary: 'Actualizar un usuario completo (updateUser)',
      description: 'Reemplaza o actualiza las propiedades modificables del perfil de usuario mediante ID por parámetro.',
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
              properties: {
                username: { type: 'string', example: 'Kaladin_BridgeFour' },
                email: { type: 'string', format: 'email', example: 'kaladin@bridgefour.com' },
                password: { type: 'string', format: 'password', example: 'kaladin123' }
              }
            }
          }
        }
      },
      responses: {
        200: {
          description: 'Usuario actualizado correctamente.',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  ok: { type: 'boolean', example: true },
                  data: {
                    type: 'object',
                    properties: {
                      user: { $ref: '#/components/schemas/User' }
                    },
                  }
                }
              }
            }
          }
        },
        404: { description: 'No se encontró el usuario para actualizar.' }
      }
    },
    delete: {
      operationId: 'deleteUser',
      tags: ['Users'],
      summary: 'Eliminar un usuario (deleteUser)',
      description: 'Remueve físicamente el registro del usuario del sistema utilizando el ID por parámetro.',
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string' }
        }
      ],
      responses: {
        200: {
          description: 'Usuario eliminado del sistema con éxito.',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  ok: { type: 'boolean', example: true },
                  message: { type: 'string', example: 'Usuario eliminado correctamente.' }
                }
              }
            }
          }
        },
        404: { description: 'Usuario no encontrado.' }
      }
    }
  },

  // ==========================================
  // GESTIÓN DE ROLES: /users/:id/roles
  // ==========================================
  '/users/{id}/roles': {
    patch: {
      operationId: 'setRole',
      tags: ['Users'],
      summary: 'Asignar o modificar un rol (setUserRol)',
      description: 'Aplica modificaciones parciales para establecer el rol del usuario (ej. cambiar a ADMIN_ROLE).',
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
              required: ['role'],
              properties: {
                role: { type: 'string', example: 'ADMIN_ROLE' }
              }
            }
          }
        }
      },
      responses: {
        200: {
          description: 'Rol actualizado.',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  ok: { type: 'boolean', example: true },
                  data: {
                    type: 'object',
                    properties: {
                      user: { $ref: '#/components/schemas/User' }
                    },
                  }
                }
              }
            }
          }
        },
        404: { description: 'Usuario no encontrado.' }
      }
    },
    delete: {
      operationId: 'removeRole',
      tags: ['Users'],
      summary: 'Quitar o revocar un rol (removeUserRol)',
      description: 'Uso semántico de DELETE para retirar un privilegio o resetear el rol asignado al usuario.',
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string' }
        }
      ],
      responses: {
        200: {
          description: 'Rol revocado con éxito.',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  ok: { type: 'boolean', example: true },
                  message: { type: 'string', example: 'Rol del usuario restablecido a los valores por defecto.' }
                }
              }
            }
          }
        },
        404: { description: 'Usuario no encontrado.' }
      }
    }
  }
}