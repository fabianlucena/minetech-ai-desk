
import fs from 'fs';
import path from 'path';
import logger from '../logger.js';
import { dirname } from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import { WebSocketServer } from 'ws';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const handlers = [];
try {
  logger.info('🔌  Setting up WebSockets');

  const files = fs.readdirSync(__dirname)
    .filter(file => file.endsWith('.ws.js') && file !== 'index.js');

  for (const file of files) {
    const endPointPath = '/ws/' + file
      .replace('.ws.js', '')
      .replaceAll('.', '/');

    logger.info(`    ${endPointPath} -> ${file}`);
    const fullPath = path.join(__dirname, file);
    const fileUrl = pathToFileURL(fullPath).href;
    const { default: handler } = await import(fileUrl);
    handlers.push({ path: endPointPath, handler });
  }

  logger.info('🔌  WebSockets set up successfully ✔️');
} catch (error) {
  logger.error('❌ Error setting up WebSockets:', error);
  process.exit(1);
}

const wss = new WebSocketServer({ noServer: true });

export default async function configureWebSocketServer(server) {
  server.on('upgrade', async (req, socket, head) => {
    try {
      const { url } = req;

      logger.debug(`Incoming WebSocket connection request for URL: ${url}`);
      for (const { path, handler } of handlers) {
        logger.debug(`Checking WebSocket handler for path: ${path}`);
        if (url.startsWith(path)) {
          logger.info(`🔌  WebSocket connection request for ${url} matched handler for ${path}`);
          wss.handleUpgrade(req, socket, head, handler);
          return;
        }
      }

      socket.destroy();
    } catch (error) {
      logger.error('❌ Error handling WebSocket upgrade:', error);
      socket.destroy();
    }
  });
}