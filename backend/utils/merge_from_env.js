import { toSnakeCase } from './string.js';

export function mergeFromEnv(config, prefix = '') {
  const envConfig = {};
  for (const key in config) {
    if (typeof config[key] === 'object' && config[key] !== null) {
      const nextPrefix = `${prefix}${toSnakeCase(key).toUpperCase()}_`;
      envConfig[key] = mergeFromEnv(config[key], nextPrefix);
    } else {
      const envKey = `${prefix}${toSnakeCase(key).toUpperCase()}`;
      if (process.env[envKey] !== undefined) {
        const raw = process.env[envKey];
        const current = config[key];

        if (typeof current === 'number')
          envConfig[key] = Number(raw);
        else if (typeof current === 'boolean')
          envConfig[key] = raw === 'true' || raw === '1';
        else
          envConfig[key] = raw;
      } else {
        envConfig[key] = config[key];
      }
    }
  }

  return envConfig;
}