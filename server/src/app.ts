import express, { type Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { pinoHttp } from 'pino-http';
import swaggerUi from 'swagger-ui-express';
import { env } from './config/env.js';
import { logger } from './lib/logger.js';
import { buildOpenApiDocument } from './lib/openapi.js';
import { authenticate } from './middleware/authenticate.js';
import { errorHandler, notFound } from './middleware/error-handler.js';
import { authApi } from './modules/auth.routes.js';
import { meApi } from './modules/me.routes.js';
import { usersApi } from './modules/users.routes.js';
import { citiesApi, writerCitiesApi } from './modules/cities.routes.js';
import { cityPlacesApi, placesApi, writerCityPlacesApi } from './modules/places.routes.js';
import { npcsApi, placeNpcsApi, writerPlaceNpcsApi } from './modules/npcs.routes.js';
import { chaptersApi, npcChaptersApi } from './modules/chapters.routes.js';

export const API_PREFIX = '/api/v1';
const apis = [
  authApi,
  meApi,
  usersApi,
  citiesApi,
  cityPlacesApi,
  placesApi,
  writerCitiesApi,
  writerCityPlacesApi,
  writerPlaceNpcsApi,
  placeNpcsApi,
  npcsApi,
  npcChaptersApi,
  chaptersApi,
];

export function createApp(): Express {
  const app = express();
  app.disable('x-powered-by');
  app.set('trust proxy', 1);

  app.use(pinoHttp({ logger, autoLogging: { ignore: (req) => req.url === '/health' } }));
  app.use(helmet());
  app.use(cors({ origin: env.CORS_ORIGINS, credentials: true }));
  app.use(express.json({ limit: '1mb' }));
  app.use(cookieParser());
  app.use(authenticate);

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  const openApi = buildOpenApiDocument(API_PREFIX);
  app.get('/openapi.json', (_req, res) => {
    res.json(openApi);
  });
  // Swagger UI usa scripts inline que la CSP de helmet bloquearía
  app.use('/docs', helmet({ contentSecurityPolicy: false }), swaggerUi.serve, swaggerUi.setup(openApi, {
    swaggerOptions: { withCredentials: true, persistAuthorization: true },
  }));

  for (const api of apis) app.use(API_PREFIX + api.prefix, api.router);

  app.use(notFound);
  app.use(errorHandler);
  return app;
}
