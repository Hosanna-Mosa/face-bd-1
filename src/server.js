'use strict';

const http = require('http');
const { connectToDatabase } = require('./setup/database');
const { createApp } = require('./setup/app');
const { logger } = require('./setup/logger');

const PORT = process.env.PORT;

async function start() {
  await connectToDatabase();
  const app = createApp();
  const server = http.createServer(app);
  server.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
  });
  process.on('SIGINT', () => {
    logger.warn('Received SIGINT. Shutting down...');
    server.close(() => process.exit(0));
  });
  process.on('SIGTERM', () => {
    logger.warn('Received SIGTERM. Shutting down...');
    server.close(() => process.exit(0));
  });
}
start().catch((error) => {
  // eslint-disable-next-line no-console
  console.error('Fatal startup error:', error);
  process.exit(1);
});