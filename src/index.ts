import { parseConfig } from './config/environment.js';
import { setupServer } from './server/setup.js';
import * as logger from './utils/logger.js';

const config = parseConfig();
logger.setLogLevel(config.logLevel);

let isShuttingDown = false;

function shutdown(): void {
  if (isShuttingDown) return;
  isShuttingDown = true;

  logger.info('Kontra shutting down');
  process.exit(0);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

async function main(): Promise<void> {
  try {
    await setupServer(config);
  } catch (error) {
    logger.error('Failed to start Kontra', {
      error: error instanceof Error ? error.message : String(error),
    });
    process.exit(1);
  }
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
