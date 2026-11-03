import mongoose from 'mongoose';
import { afterAll, beforeAll, beforeEach } from 'vitest';

// Se fijan antes de importar la config: process.loadEnvFile no pisa variables ya definidas
process.env.NODE_ENV = 'test';
process.env.MONGODB_URI = process.env.TEST_MONGODB_URI ?? 'mongodb://127.0.0.1:27017/world_of_stories_test';
process.env.JWT_SECRET = 'test-secret-de-al-menos-treinta-y-dos-caracteres';
process.env.WRITER_INVITE_CODE = 'codigo-escritor';

beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URI!);
  await Promise.all(Object.values(mongoose.models).map((m) => m.syncIndexes()));
});

beforeEach(async () => {
  await Promise.all(Object.values(mongoose.connection.collections).map((c) => c.deleteMany({})));
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
});
