
import fs from 'fs';
import path from 'path';
import logger from '../logger.js';
import { dirname } from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import { WebSocketServer } from 'ws';
import { matchRoute } from '../utils/url.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const handlers = [];
try {
  logger.info('🔌  Setting up WebSockets');

  const files = fs.readdirSync(__dirname)
    .filter(file => file.endsWith('.ws.js') && file !== 'index.js');

  for (const file of files) {
    const fullPath = path.join(__dirname, file);
    const fileUrl = pathToFileURL(fullPath).href;
    const wsConfig = await import(fileUrl);
    if (wsConfig.routes) {
      for (const [route, handler] of Object.entries(wsConfig.routes)) {
        logger.info(`    ${route} -> ${file}`);
        handlers.push({ route, handler });
      }
    } else {
      const handler = wsConfig.handler || wsConfig.default;
      if (!handler) {
        logger.warn(`No handler found in ${file}, skipping`);
        continue;
      }

      const endPointPath = '/ws/' + file
        .replace('.ws.js', '')
        .replaceAll('.', '/');

      logger.info(`    ${endPointPath} -> ${file}`);
      handlers.push({ route: endPointPath, handler });
    }
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
      for (const { route, handler } of handlers) {
        logger.debug(`Checking WebSocket handler for route: ${route}`);
        const { match, params } = matchRoute(route, url);
        if (!match)
          continue;

        logger.info(`🔌  WebSocket connection request for ${url} matched handler for ${route}`);
        wss.handleUpgrade(req, socket, head, (ws) => {
          ws.params = params;
          handler(ws);
        });
        return;
      }

      socket.destroy();
    } catch (error) {
      logger.error('❌ Error handling WebSocket upgrade:', error);
      socket.destroy();
    }
  });
}