import { createRequire } from 'node:module';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import type { ServerConfig } from '../types.js';
import { registerKontraTools } from '../tools/kontra.js';
import * as logger from '../utils/logger.js';

const require = createRequire(import.meta.url);
const { version } = require('../../package.json') as { version: string };

export async function setupServer(config: ServerConfig): Promise<void> {
  const server = new McpServer({
    name: 'kontra-mcp',
    version,
  });

  registerKontraTools(server, config.defaultMode);

  logger.info('Kontra MCP server starting', { defaultMode: config.defaultMode });

  const transport = new StdioServerTransport();
  await server.connect(transport);
}
