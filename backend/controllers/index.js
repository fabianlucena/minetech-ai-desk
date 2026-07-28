import fs from 'fs';
import path from 'path';
import logger from '../logger.js';
import { dirname } from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import { addDependency } from '../dependency.js';
import { toCamelCase } from '../utils/string.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function run() {
  try {
    logger.info('🎛️  Configurando controladores');

    const files = fs.readdirSync(__dirname)
      .filter(file => file.endsWith('.controller.js') && file !== 'index.js');

    for (const file of files) {
      const controllerName = toCamelCase(file.replace('.controller.js', ''))
        + 'Controller';

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