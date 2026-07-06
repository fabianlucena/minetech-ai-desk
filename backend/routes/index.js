import { Router } from 'express';
import fs from 'fs';
import path from 'path';
import logger from '../logger.js';
import { dirname } from 'path';
import { fileURLToPath, pathToFileURL  } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = Router();

export function snakeToCamel(str) {
  return str.replace(/[_-]([a-z])/g, (_, letter) => letter.toUpperCase());
}

try {
  logger.info('🛢️  Configurando rutas');

  const files = fs.readdirSync(__dirname)
    .filter(file => file.endsWith('.routes.js') && file !== 'index.js');

  for (const file of files) {
    const endPointPath = '/' + file.replace('.routes.js', '');

    logger.info(`    ${endPointPath} -> ${file}`);
    const fullPath = path.join(__dirname, file);
    const fileUrl = pathToFileURL(fullPath).href;
    const { default: routes } = await import(fileUrl);
    router.use(endPointPath, routes);
  }

  logger.info('🛢️  Rutas configuradas OK ✔️');
} catch (error) {
  logger.error('❌ Error al configurar rutas:', error);
  process.exit(1);
}

export default router;