import { addDependency } from './dependency.js';
import { mergeFromEnv } from './utils/merge_from_env.js';

let config = {
  port: 3000,

  dbName: 'minetech-ai-desk',
  dbUser: 'minetech-ai-desk',
  dbPass: 'password',
  dbHost: 'localhost',
  dbPort: 5432,
  
  tokenSize: 64,
  sessionExpiration: 60 * 60 * 24 * 1, // 1 day

  whatsapp: {
    baseUrl: '',
    appSecret: '',
    verifyToken: '',
    token: '',
    phoneId: '',
  },
};

try {
  const custom = await import('./config.local.js');
  config = { ...config, ...custom.default };

  mergeFromEnv(config);
} catch (err) {
  if (err.code === 'ERR_MODULE_NOT_FOUND') {
    console.warn('\x1b[33mArchivo config.local.js no encontrado, usando valores por defecto\x1b[0m');
  } else {
    throw err;
  }
}

addDependency('config', config);

export default config;