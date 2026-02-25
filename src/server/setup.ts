import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import type { ServerConfig } from '../types.js';
import { registerKontraTool } from '../tools/kontra.js';
import * as logger from '../utils/logger.js';

export async function setupServer(config: ServerConfig): Promise<void> {
  const server = new McpServer({
    name: 'kontra-mcp',
    version: '0.1.0',
  });

  registerKontraTool(server, config.defaultMode);

  logger.info('Kontra MCP server starting', { defaultMode: config.defaultMode });

  const transport = new StdioServerTransport();
  await server.connect(transport);
}
