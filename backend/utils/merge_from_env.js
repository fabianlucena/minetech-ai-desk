import { toSnakeCase } from './string.js';

export function mergeFromEnv(config, prefix = '') {
  const envConfig = {};
  for (const key in config) {
    if (typeof config[key] === 'object' && config[key] !== null) {
      envConfig[key] = mergeFromEnv(config[key], `${prefix}${key}_`);
    } else {
      const envKey = prefix + toSnakeCase(key).toUpperCase();
      if (process.env[envKey] !== undefined) {
        envConfig[key] = process.env[envKey];
      } else {
        envConfig[key] = config[key];
      }
    }
  }

  return envConfig;
}