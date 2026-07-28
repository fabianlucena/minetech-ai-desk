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
    logger.info('🛠️  Setting up services');

    const files = fs.readdirSync(__dirname)
      .filter(file => file.endsWith('.service.js') && file !== 'index.js');

    for (const file of files) {
      const serviceName = toCamelCase(file.replace('.service.js', ''))
        + 'Service';

      logger.info(`    ${serviceName} -> ${file}`);
      const fullPath = path.join(__dirname, file);
      const fileUrl = pathToFileURL(fullPath).href;
      const service = await import(fileUrl);
      addDependency(serviceName, () => new service.default());
    }

    logger.info('🛠️  Services configured OK ✔️');
  } catch (error) {
    logger.error('❌ Error setting up services:', error);
    process.exit(1);
  }
}

await run();