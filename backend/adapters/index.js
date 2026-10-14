import fs from 'fs';
import path from 'path';
import logger from '../logger.js';
import { dirname } from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import { addDependency } from '../dependency.js';
import { toCamelCase } from '../utils/string.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const adapters = [];

async function run() {
  try {
    logger.info('🔌  Setting up adapters');

    const files = fs.readdirSync(__dirname)
      .filter(file => file.endsWith('.adapter.js') && file !== 'index.js');

    for (const file of files) {
      const adapterName = toCamelCase(file.replace('.adapter.js', ''))
        + 'Adapter';

      logger.info(`    ${adapterName} -> ${file}`);
      const fullPath = path.join(__dirname, file);
      const fileUrl = pathToFileURL(fullPath).href;
      const adapter = await import(fileUrl);
      adapters.push(adapter);
      addDependency(adapterName, () => adapter);
    }

    logger.info('🔌  Adapters set up OK ✔️');

    return adapters;
  } catch (error) {
    logger.error('❌ Error setting up adapters:', error);
    process.exit(1);
  }
}

await run();

export async function init() {
  for (const adapter of adapters) {
    if (typeof adapter.init === 'function') {
      await adapter.init();
    }
  }
}