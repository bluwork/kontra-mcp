import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { KontraMode } from '../types.js';
import { buildCounterPrompt } from '../prompts/counter.js';
import { buildProbePrompt } from '../prompts/probe.js';
import { buildRedteamPrompt } from '../prompts/redteam.js';
import { buildPremortemPrompt } from '../prompts/premortem.js';
import * as logger from '../utils/logger.js';

const PROMPT_BUILDERS: Record<KontraMode, (statement: string, context?: string) => string> = {
  counter: buildCounterPrompt,
  probe: buildProbePrompt,
  redteam: buildRedteamPrompt,
  premortem: buildPremortemPrompt,
};

const kontraSchema = {
  statement: z.string().describe('The decision, plan, or conclusion to analyze'),
  context: z.string().optional().describe('Additional background, constraints, or data relevant to the decision'),
  mode: z
    .enum(['counter', 'probe', 'redteam', 'premortem'])
    .optional()
    .describe('Analysis mode: "counter" for contrarian analysis, "probe" for deep questioning, "redteam" for adversarial testing, "premortem" for failure scenario analysis.'),
};

export function registerKontraTools(server: McpServer, defaultMode: KontraMode): void {
  server.tool(
    'kontra',
    'The Tenth Man Protocol — structured contrarian analysis. Challenges your decisions by identifying blind spots, hidden assumptions, counter-arguments, and failure scenarios. Provide a statement to analyze and optionally additional context.',
    kontraSchema,
    async (args) => {
      const mode = args.mode ?? defaultMode;

      logger.info('kontra tool called', { mode, statementLength: args.statement.length });

      const builder = PROMPT_BUILDERS[mode];
      const prompt = builder(args.statement, args.context);

      logger.debug('Generated prompt', { mode, promptLength: prompt.length });

      return {
        content: [{ type: 'text' as const, text: prompt }],
      };
    }
  );
}
