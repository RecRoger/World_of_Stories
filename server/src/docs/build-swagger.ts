import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import swaggerDocument from './swagger.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const outputPath = path.join(__dirname, 'swagger.json');

try {
  fs.writeFileSync(outputPath, JSON.stringify(swaggerDocument, null, 2), 'utf-8');
  console.log('✅ ¡swagger.json generado con éxito!');
} catch (error) {
  console.error('❌ Error al escribir el archivo swagger.json:', error);
  process.exit(1);
}