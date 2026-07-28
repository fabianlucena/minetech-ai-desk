import { Router } from 'express';
import fs from 'fs';
import path from 'path';
import logger from '../logger.js';
import { dirname } from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = Router();

async function run() {
  try {
    logger.info('🛣️  Setting up routes');

    const files = fs.readdirSync(__dirname)
      .filter(file => file.endsWith('.routes.js') && file !== 'index.js');

    for (const file of files) {
      const endPointPath = '/' + file
        .replace('.routes.js', '')
        .replaceAll('.', '/');

      logger.info(`    ${endPointPath} -> ${file}`);
      const fullPath = path.join(__dirname, file);
      const fileUrl = pathToFileURL(fullPath).href;
      const { default: routes } = await import(fileUrl);
      router.use(endPointPath, routes);
    }

    logger.info('🛣️  Routes set up successfully ✔️');
  } catch (error) {
    logger.error('❌ Setting up routes:', error);
    process.exit(1);
  }
}

await run();

export default router;