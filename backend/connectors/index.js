import fs from 'fs';
import path from 'path';
import logger from '../logger.js';
import { dirname } from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import { addDependency } from '../dependency.js';
import { toCamelCase } from '../utils/string.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const connectors = [];

async function run() {
  try {
    logger.info('🎛️  Configurando conectores');

    const files = fs.readdirSync(__dirname)
      .filter(file => file.endsWith('.connector.js') && file !== 'index.js');

    for (const file of files) {
      const connectorName = toCamelCase(file.replace('.connector.js', ''))
        + 'Connector';

      logger.info(`    ${connectorName} -> ${file}`);
      const fullPath = path.join(__dirname, file);
      const fileUrl = pathToFileURL(fullPath).href;
      const connector = await import(fileUrl);
      connectors.push(connector);
      addDependency(connectorName, () => connector);
    }

    logger.info('🎛️  Conectores configurados OK ✔️');

    return connectors;
  } catch (error) {
    logger.error('❌ Error al configurar conectores:', error);
    process.exit(1);
  }
}

await run();

export async function init() {
  for (const connector of connectors) {
    if (typeof connector.init === 'function') {
      await connector.init();
    }
  }
}