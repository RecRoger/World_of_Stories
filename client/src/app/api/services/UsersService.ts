/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import type { Observable } from 'rxjs';
import type { User } from '../models/User';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
@Injectable({
    providedIn: 'root',
})
export class UsersService {
    constructor(public readonly http: HttpClient) {}
    /**
     * Obtener todos los usuarios (getAllUsers)
     * Retorna el listado completo de los usuarios registrados en el sistema.
     * @returns any Lista de usuarios recuperada con éxito.
     * @throws ApiError
     */
    public getUsers(): Observable<{
        ok?: boolean;
        users?: Array<User>;
    }> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/users',
            errors: {
                500: `Error interno del servidor.`,
            },
        });
    }
    /**
     * Crear un nuevo usuario (saveUser)
     * Registra un usuario en la base de datos. Retorna un código 201 Created al completarse.
     * @param requestBody
     * @returns any Usuario creado exitosamente.
     * @throws ApiError
     */
    public postUsers(
        requestBody: {
            userName: string;
            email: string;
            username?: string;
            password: string;
        },
    ): Observable<{
        ok?: boolean;
        user?: User;
    }> {
        return __request(OpenAPI, this.http, {
            method: 'POST',
            url: '/users',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Campos inválidos o faltantes.`,
                409: `El nombre de usuario o email ya existen.`,
            },
        });
    }
    /**
     * Iniciar sesión (getOneUser)
     * Verifica las credenciales enviadas en el body por motivos de seguridad y retorna el usuario autenticado.
     * @param requestBody
     * @returns any Autenticación exitosa.
     * @throws ApiError
     */
    public postUsersLogin(
        requestBody: {
            username?: string;
            password: string;
        },
    ): Observable<{
        ok?: boolean;
        user?: User;
    }> {
        return __request(OpenAPI, this.http, {
            method: 'POST',
            url: '/users/login',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Contraseña incorrecta.`,
                404: `El usuario no existe.`,
            },
        });
    }
    /**
     * Obtener usuario por ID (getUserById)
     * @param id ID único de MongoDB del usuario
     * @returns any Usuario encontrado.
     * @throws ApiError
     */
    public getUsers1(
        id: string,
    ): Observable<{
        ok?: boolean;
        user?: User;
    }> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/users/{id}',
            path: {
                'id': id,
            },
            errors: {
                404: `Usuario no encontrado.`,
            },
        });
    }
    /**
     * Actualizar un usuario completo (updateUser)
     * Reemplaza o actualiza las propiedades modificables del perfil de usuario mediante ID por parámetro.
     * @param id
     * @param requestBody
     * @returns any Usuario actualizado correctamente.
     * @throws ApiError
     */
    public putUsers(
        id: string,
        requestBody: {
            userName?: string;
            email?: string;
            password?: string;
        },
    ): Observable<{
        ok?: boolean;
        user?: User;
    }> {
        return __request(OpenAPI, this.http, {
            method: 'PUT',
            url: '/users/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                404: `No se encontró el usuario para actualizar.`,
            },
        });
    }
    /**
     * Eliminar un usuario (deleteUser)
     * Remueve físicamente el registro del usuario del sistema utilizando el ID por parámetro.
     * @param id
     * @returns any Usuario eliminado del sistema con éxito.
     * @throws ApiError
     */
    public deleteUsers(
        id: string,
    ): Observable<{
        ok?: boolean;
        message?: string;
    }> {
        return __request(OpenAPI, this.http, {
            method: 'DELETE',
            url: '/users/{id}',
            path: {
                'id': id,
            },
            errors: {
                404: `Usuario no encontrado.`,
            },
        });
    }
    /**
     * Asignar o modificar un rol (setUserRol)
     * Aplica modificaciones parciales para establecer el rol del usuario (ej. cambiar a ADMIN_ROLE).
     * @param id
     * @param requestBody
     * @returns any Rol actualizado.
     * @throws ApiError
     */
    public patchUsersRoles(
        id: string,
        requestBody: {
            role: string;
        },
    ): Observable<{
        ok?: boolean;
        user?: User;
    }> {
        return __request(OpenAPI, this.http, {
            method: 'PATCH',
            url: '/users/{id}/roles',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                404: `Usuario no encontrado.`,
            },
        });
    }
    /**
     * Quitar o revocar un rol (removeUserRol)
     * Uso semántico de DELETE para retirar un privilegio o resetear el rol asignado al usuario.
     * @param id
     * @returns any Rol revocado con éxito.
     * @throws ApiError
     */
    public deleteUsersRoles(
        id: string,
    ): Observable<{
        ok?: boolean;
        message?: string;
    }> {
        return __request(OpenAPI, this.http, {
            method: 'DELETE',
            url: '/users/{id}/roles',
            path: {
                'id': id,
            },
            errors: {
                404: `Usuario no encontrado.`,
            },
        });
    }
}
