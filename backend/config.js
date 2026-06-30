let config = {
  port: 3000,
  dbConnectionString: 'postgres://minetech-ai-desk:password@localhost:5432/minetech-ai-desk',
};

try {
  const custom = await import('./config.local.js');
  config = { ...config, ...custom.default };
} catch (err) {
  if (err.code === 'ERR_MODULE_NOT_FOUND') {
    console.warn('\x1b[33mArchivo config.local.js no encontrado, usando valores por defecto\x1b[0m');
  } else {
    throw err;
  }
}

export default config;