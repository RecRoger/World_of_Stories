import { Response } from 'express';

export const logError = (resp: Response, err: any, message: string): Response => {
    return resp.status(500).json({
        ok: false,
        message: 'Error interno del servidor al recuperar los usuarios',
        error: err instanceof Error ? err.message : err
    });

}
