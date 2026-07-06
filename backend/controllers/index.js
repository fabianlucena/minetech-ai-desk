import { Router } from 'express';
import fs from 'fs';
import path from 'path';
import logger from '../logger.js';
import { dirname } from 'path';
import { fileURLToPath, pathToFileURL  } from 'url';
import { addDependency } from '../dependency.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export function snakeToCamel(str) {
  return str.replace(/[_-]([a-z])/g, (_, letter) => letter.toUpperCase());
}

async function run() {
  try {
    logger.info('🎛️  Configurando controladores');

    const files = fs.readdirSync(__dirname)
      .filter(file => file.endsWith('.controller.js') && file !== 'index.js');

    for (const file of files) {
      const controllerName = file.replace('.controller.js', '') + 'Controller';

      logger.info(`    ${controllerName} -> ${file}`);
      const fullPath = path.join(__dirname, file);
      const fileUrl = pathToFileURL(fullPath).href;
      const controller = await import(fileUrl);
      addDependency(controllerName, () => controller);
    }

    logger.info('🎛️  Controladores configurados OK ✔️');
  } catch (error) {
    logger.error('❌ Error al configurar controladores:', error);
    process.exit(1);
  }
}

await run();