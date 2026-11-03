// Asigna roles a un usuario: npm run set-roles -- <username|email> Admin Writer
import mongoose from 'mongoose';
import { roleSchema } from '@wos/shared';
import { env } from '../config/env.js';
import { User } from '../models/user.model.js';

const [identifier, ...rawRoles] = process.argv.slice(2);
const roles = rawRoles.map((r) => roleSchema.parse(r));
if (!identifier || roles.length === 0) {
  console.error('Uso: npm run set-roles -- <username|email> <Reader|Writer|Admin>...');
  process.exit(1);
}

await mongoose.connect(env.MONGODB_URI);
const user = await User.findOneAndUpdate(
  { $or: [{ username: identifier }, { email: identifier.toLowerCase() }] },
  { $set: { role: roles } },
  { new: true },
);
console.log(user ? `✅ ${user.username}: ${user.role.join(', ')}` : `❌ No existe el usuario "${identifier}"`);
await mongoose.disconnect();
