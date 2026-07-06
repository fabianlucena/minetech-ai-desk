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
    logger.info('🛠️  Configurando servicios');

    const files = fs.readdirSync(__dirname)
      .filter(file => file.endsWith('.service.js') && file !== 'index.js');

    for (const file of files) {
      const serviceName = snakeToCamel(file.replace('.service.js', ''))
        + 'Service';

      logger.info(`    ${serviceName} -> ${file}`);
      const fullPath = path.join(__dirname, file);
      const fileUrl = pathToFileURL(fullPath).href;
      const service = await import(fileUrl);
      addDependency(serviceName, () => new service.default());
    }

    logger.info('🛠️  Servicios configurados OK ✔️');
  } catch (error) {
    logger.error('❌ Error al configurar servicios:', error);
    process.exit(1);
  }
}

await run();