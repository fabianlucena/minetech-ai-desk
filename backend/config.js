import { addDependency } from './dependency.js';
import { mergeFromEnv } from './utils/merge_from_env.js';
import { deepMerge } from './utils/object.js';

let config = {
  port: 3000,

  dbName: 'minetech-ai-desk',
  dbUser: 'minetech-ai-desk',
  dbPass: 'password',
  dbHost: 'localhost',
  dbPort: 5432,
  
  tokenSize: 64,
  sessionExpiration: 60 * 60 * 24 * 1, // 1 day
  maxWSErrorCount: 3,

  whatsapp: {
    baseUrl: '',
    appSecret: '',
    verifyToken: '',
    token: '',
    phoneId: '',
    messageUrl: 'https://graph.facebook.com/v20.0/{phoneId}/messages',
    timeout: 10000,
  },
};

try {
  const custom = await import('./config.local.js');
  config = deepMerge(config, custom.default);

  mergeFromEnv(config);
} catch (err) {
  if (err.code === 'ERR_MODULE_NOT_FOUND') {
    console.warn('\x1b[33mconfig.local.js file not found, using default values\x1b[0m');
  } else {
    throw err;
  }
}

addDependency('config', config);

export default config;