import { z } from 'zod';

// Carga server/.env si existe (Node >= 20.12); las variables ya definidas en el entorno tienen prioridad
try {
  process.loadEnvFile();
} catch {
  // sin .env: se usan las variables del entorno
}

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(3000),
  MONGODB_URI: z.string().default('mongodb://127.0.0.1:27017/world_of_stories'),
  JWT_SECRET: z.string().min(32, 'JWT_SECRET debe tener al menos 32 caracteres'),
  JWT_EXPIRES_IN_DAYS: z.coerce.number().int().positive().default(7),
  CORS_ORIGINS: z
    .string()
    .default('http://localhost:5173,http://localhost:4200')
    .transform((s) => s.split(',').map((o) => o.trim()).filter(Boolean)),
  WRITER_INVITE_CODE: z.string().min(1).optional(),
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent']).default('info'),
});

const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
  console.error('❌ Variables de entorno inválidas:\n' + z.prettifyError(parsed.error));
  process.exit(1);
}

export const env = parsed.data;
export const isProduction = env.NODE_ENV === 'production';
