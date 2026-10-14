import fs from 'fs';
import path from 'path';
import logger from '../logger.js';
import { dirname } from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import { addDependency } from '../dependency.js';
import { toCamelCase } from '../utils/string.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const controllers = [];

async function run() {
  try {
    logger.info('🎛️  Setting up controllers');

    const files = fs.readdirSync(__dirname)
      .filter(file => file.endsWith('.controller.js') && file !== 'index.js');

    for (const file of files) {
      const controllerName = toCamelCase(file.replace('.controller.js', ''))
        + 'Controller';

      logger.info(`    ${controllerName} -> ${file}`);
      const fullPath = path.join(__dirname, file);
      const fileUrl = pathToFileURL(fullPath).href;
      const controller = await import(fileUrl);
      controllers.push(controller);
      addDependency(controllerName, () => controller);
    }

    logger.info('🎛️  Controllers set up OK ✔️');

    return controllers;
  } catch (error) {
    logger.error('❌ Error setting up controllers:', error);
    process.exit(1);
  }
}

await run();

export async function init() {
  for (const controller of controllers) {
    if (typeof controller.init === 'function') {
      await controller.init();
    }
  }
}