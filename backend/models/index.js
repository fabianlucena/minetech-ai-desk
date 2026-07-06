import fs from 'fs';
import path from 'path';
import sequelize from '../database.js';
import logger from '../logger.js';
import { dirname } from 'path';
import { fileURLToPath, pathToFileURL  } from 'url';
import { addDependency } from '../dependency.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const db = {};

try {
  await sequelize.authenticate();
  logger.info('🛢️  Configurando BDD y modelos');
  logger.info('  Conexión a la base OK ✔️');

  logger.info('  Importando modelos:');
  const files = fs.readdirSync(__dirname)
    .filter(file => file.endsWith('.js') && file !== 'index.js');

  for (const file of files) {
    logger.info(`    ${file}`);
    const fullPath = path.join(__dirname, file);
    const fileUrl = pathToFileURL(fullPath).href;
    const { default: modelDef } = await import(fileUrl);
    const model = modelDef(sequelize);
    db[model.name] = model;
  }

  logger.info('  Modelos importados OK ✔️');
  logger.info('  Configurando asociaciones:');
  for (const model of Object.values(db)) {
    if (typeof model.associate === 'function') {      
      logger.info(`    ${model.name}`);
      model.associate(db);
    }
  }

  logger.info('  Asociaciones configuradas OK ✔️');

  for (const model of Object.values(db)) {
    const ModelName = model.name;
    const modelName = ModelName[0].toLocaleLowerCase() + ModelName.substring(1) + 'Model';
    addDependency(modelName, () => model);
  }

  logger.info('🛢️  BDD y modelos configurados OK ✔️');
} catch (error) {
  logger.error('❌ Error de conexión:', error);
  process.exit(1);
}

export default db;