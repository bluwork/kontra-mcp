# Kontra Core Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build and ship Kontra Core — a single MCP tool that provides structured contrarian analysis using the prompt-return pattern.

**Architecture:** Kontra is a stdio MCP server exposing one tool (`kontra`). It constructs an adversarial prompt based on the user's statement, context, and mode, then returns it as the tool response for the client's LLM to process. No external API calls. Counter mode active; probe/redteam/premortem gated behind Pro.

**Tech Stack:** TypeScript, Node.js, @modelcontextprotocol/sdk, zod

---

### Task 1: Initialize project and install dependencies

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `.gitignore`

**Step 1: Initialize git repo**

Run: `cd /home/blu/development/copilot-mcp/kontra-mcp && git init`
Expected: Initialized empty Git repository

**Step 2: Create package.json**

```json
{
  "name": "kontra-mcp",
  "version": "0.1.0",
  "description": "The Tenth Man Protocol — structured contrarian analysis for decision-makers via MCP",
  "main": "dist/index.js",
  "type": "module",
  "scripts": {
    "build": "tsc",
    "start": "node dist/index.js",
    "dev": "npx ts-node --esm src/index.ts",
    "watch": "tsc --watch",
    "prepare": "chmod +x bin/cli.js"
  },
  "bin": {
    "kontra-mcp": "./bin/cli.js",
    "kontra": "./bin/cli.js"
  },
  "keywords": [
    "mcp",
    "model-context-protocol",
    "contrarian",
    "devil-advocate",
    "tenth-man",
    "decision-making",
    "red-team",
    "claude",
    "ai-assistant"
  ],
  "author": "Boban Lukic <boban@lukic.engineering>",
  "license": "MIT",
  "dependencies": {
    "@modelcontextprotocol/sdk": "^1.21.1",
    "zod": "^3.25.76"
  },
  "devDependencies": {
    "@types/node": "^22.19.0",
    "typescript": "^5.9.3"
  }
}
```

**Step 3: Create tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "outDir": "dist",
    "rootDir": "src",
    "strict": true,
    "esModuleInterop": true,
    "moduleResolution": "NodeNext",
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "resolveJsonModule": true,
    "allowSyntheticDefaultImports": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

**Step 4: Create .gitignore**

```
node_modules/
dist/
logs/
*.log
.DS_Store
```

**Step 5: Install dependencies**

Run: `cd /home/blu/development/copilot-mcp/kontra-mcp && npm install`
Expected: Dependencies installed successfully

**Step 6: Commit**

```bash
git add package.json tsconfig.json .gitignore package-lock.json
git commit -m "chore: initialize kontra-mcp project with dependencies"
```

---

### Task 2: Create types and configuration

**Files:**
- Create: `src/types.ts`
- Create: `src/config/environment.ts`
- Create: `src/utils/logger.ts`

**Step 1: Create src/types.ts**

```typescript
export type KontraMode = 'counter' | 'probe' | 'redteam' | 'premortem';

export interface KontraInput {
  statement: string;
  context?: string;
  mode?: KontraMode;
}

export interface ServerConfig {
  defaultMode: KontraMode;
  logLevel: 'debug' | 'info' | 'warn' | 'error';
}

export const FREE_MODES: readonly KontraMode[] = ['counter'] as const;

export const PRO_MODES: readonly KontraMode[] = ['probe', 'redteam', 'premortem'] as const;
```

**Step 2: Create src/config/environment.ts**

```typescript
import type { ServerConfig, KontraMode } from '../types.js';

const VALID_MODES: KontraMode[] = ['counter', 'probe', 'redteam', 'premortem'];
const VALID_LOG_LEVELS = ['debug', 'info', 'warn', 'error'] as const;

export function parseConfig(): ServerConfig {
  const defaultMode = (process.env.KONTRA_DEFAULT_MODE || 'counter') as KontraMode;
  const logLevel = (process.env.KONTRA_LOG_LEVEL || 'info') as ServerConfig['logLevel'];

  if (!VALID_MODES.includes(defaultMode)) {
    process.stderr.write(
      `[kontra] Invalid KONTRA_DEFAULT_MODE "${defaultMode}". Using "counter".\n`
    );
    return { defaultMode: 'counter', logLevel };
  }

  if (!VALID_LOG_LEVELS.includes(logLevel)) {
    process.stderr.write(
      `[kontra] Invalid KONTRA_LOG_LEVEL "${logLevel}". Using "info".\n`
    );
    return { defaultMode, logLevel: 'info' };
  }

  return { defaultMode, logLevel };
}
```

**Step 3: Create src/utils/logger.ts**

```typescript
type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const LEVEL_PRIORITY: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

let currentLevel: LogLevel = 'info';

export function setLogLevel(level: LogLevel): void {
  currentLevel = level;
}

function log(level: LogLevel, message: string, data?: unknown): void {
  if (LEVEL_PRIORITY[level] < LEVEL_PRIORITY[currentLevel]) return;

  const timestamp = new Date().toISOString();
  const entry = data
    ? `[${timestamp}] [${level.toUpperCase()}] ${message} ${JSON.stringify(data)}`
    : `[${timestamp}] [${level.toUpperCase()}] ${message}`;

  process.stderr.write(entry + '\n');
}

export function debug(message: string, data?: unknown): void {
  log('debug', message, data);
}

export function info(message: string, data?: unknown): void {
  log('info', message, data);
}

export function warn(message: string, data?: unknown): void {
  log('warn', message, data);
}

export function error(message: string, data?: unknown): void {
  log('error', message, data);
}
```

**Step 4: Create directory structure**

Run: `mkdir -p src/config src/utils src/server src/tools src/prompts bin`

**Step 5: Commit**

```bash
git add src/types.ts src/config/environment.ts src/utils/logger.ts
git commit -m "feat: add types, configuration, and logger"
```

---

### Task 3: Write the counter mode prompt

This is the core IP. The prompt must establish the Tenth Man identity, guide structured analysis, and ensure evidence-based dissent.

**Files:**
- Create: `src/prompts/counter.ts`

**Step 1: Create src/prompts/counter.ts**

```typescript
export function buildCounterPrompt(statement: string, context?: string): string {
  const contextBlock = context
    ? `\nCONTEXT PROVIDED BY THE DECISION-MAKER:\n${context}\n`
    : '';

  return `[KONTRA — The Tenth Man Protocol]

You are now the Tenth Man. This is not a suggestion — it is your assignment.

The Tenth Man Doctrine: If nine people in a room agree on a course of action, the tenth is obligated to assume they are wrong and investigate accordingly. This principle was established after the 1973 Yom Kippur War intelligence failure, to ensure that consensus is never mistaken for correctness.

You have been presented with a decision. Your job is to assume it is WRONG and build the strongest possible case against it. You are not being helpful. You are not being encouraging. You are being rigorous.

DECISION UNDER ANALYSIS:
"${statement}"
${contextBlock}
YOUR ASSIGNMENT:

1. BLIND SPOTS — What can the decision-maker not see from their current position? What information are they missing? What perspectives have they not considered? Identify at least 3 blind spots.

2. HIDDEN ASSUMPTIONS — What unstated beliefs is this decision built on? What must be true for this decision to succeed, that the decision-maker has not explicitly verified? Surface at least 3 assumptions.

3. THE STRONGEST COUNTER-ARGUMENT — Construct a single, devastating argument against this decision. Not a list of minor objections — one coherent, well-reasoned case that a smart opponent would make. Build it as if you are opposing counsel in a trial.

4. WHAT-IF SCENARIOS — Generate 3 concrete scenarios in which this decision leads to failure. Each should be specific and plausible, not abstract. Name the trigger event, the cascade of consequences, and why the decision-maker didn't see it coming.

RULES OF ENGAGEMENT:
- Do not soften your analysis with encouragement or validation
- Do not say "this is a good idea, but..." — start with what's wrong
- Ground every challenge in reasoning, not contrarianism for its own sake
- Be direct, incisive, and respectful — like a colleague who cares enough to tell the uncomfortable truth
- If the decision is genuinely sound, say so — but only after you have exhausted every angle of attack

Remember: "I'm not saying you're wrong. I'm obligated to find out if you are."

Provide your Tenth Man analysis now.`;
}
```

**Step 2: Commit**

```bash
git add src/prompts/counter.ts
git commit -m "feat: add counter mode adversarial prompt template"
```

---

### Task 4: Write placeholder prompts for Pro modes

**Files:**
- Create: `src/prompts/probe.ts`
- Create: `src/prompts/redteam.ts`
- Create: `src/prompts/premortem.ts`

**Step 1: Create src/prompts/probe.ts**

```typescript
export function buildProbePrompt(_statement: string, _context?: string): string {
  return `[KONTRA — Probe Mode]

Probe mode asks uncomfortable questions without providing answers. It forces the decision-maker to confront gaps in their own reasoning.

This mode is available in Kontra Pro.
Learn more: https://github.com/bluwork/kontra-mcp#kontra-pro`;
}
```

**Step 2: Create src/prompts/redteam.ts**

```typescript
export function buildRedteamPrompt(_statement: string, _context?: string): string {
  return `[KONTRA — Red Team Mode]

Red Team mode generates specific, plausible failure scenarios with estimated likelihood, cascade effects, early warning indicators, and recommended mitigations.

This mode is available in Kontra Pro.
Learn more: https://github.com/bluwork/kontra-mcp#kontra-pro`;
}
```

**Step 3: Create src/prompts/premortem.ts**

```typescript
export function buildPremortemPrompt(_statement: string, _context?: string): string {
  return `[KONTRA — Pre-Mortem Mode]

Pre-Mortem mode applies Gary Klein's prospective hindsight technique: "Imagine it is one year from now and this project has failed catastrophically. Write the postmortem."

This mode is available in Kontra Pro.
Learn more: https://github.com/bluwork/kontra-mcp#kontra-pro`;
}
```

**Step 4: Commit**

```bash
git add src/prompts/probe.ts src/prompts/redteam.ts src/prompts/premortem.ts
git commit -m "feat: add placeholder prompts for Pro modes (probe, redteam, premortem)"
```

---

### Task 5: Build the kontra tool

**Files:**
- Create: `src/tools/kontra.ts`

**Step 1: Create src/tools/kontra.ts**

```typescript
import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { KontraMode } from '../types.js';
import { FREE_MODES } from '../types.js';
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
    .default('counter')
    .describe('Analysis mode. "counter" is free. Others require Kontra Pro.'),
};

export function registerKontraTool(server: McpServer, defaultMode: KontraMode): void {
  server.tool(
    'kontra',
    'The Tenth Man Protocol — structured contrarian analysis. Challenges your decisions by identifying blind spots, hidden assumptions, counter-arguments, and failure scenarios. Provide a statement to analyze and optionally additional context.',
    kontraSchema,
    async (args) => {
      const mode = args.mode || defaultMode;

      logger.info(`kontra tool called`, { mode, statementLength: args.statement.length });

      if (!FREE_MODES.includes(mode)) {
        const builder = PROMPT_BUILDERS[mode];
        return {
          content: [{ type: 'text' as const, text: builder(args.statement, args.context) }],
        };
      }

      const builder = PROMPT_BUILDERS[mode];
      if (!builder) {
        logger.error(`Unknown mode: ${mode}`);
        return {
          content: [{ type: 'text' as const, text: `Unknown mode: ${mode}. Available modes: counter, probe, redteam, premortem.` }],
          isError: true,
        };
      }

      const prompt = builder(args.statement, args.context);

      logger.debug('Generated prompt', { mode, promptLength: prompt.length });

      return {
        content: [{ type: 'text' as const, text: prompt }],
      };
    }
  );
}
```

**Step 2: Commit**

```bash
git add src/tools/kontra.ts
git commit -m "feat: implement kontra tool with mode routing and prompt generation"
```

---

### Task 6: Build the MCP server setup

**Files:**
- Create: `src/server/setup.ts`

**Step 1: Create src/server/setup.ts**

```typescript
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
```

**Step 2: Commit**

```bash
git add src/server/setup.ts
git commit -m "feat: add MCP server setup with stdio transport"
```

---

### Task 7: Build the entry point

**Files:**
- Create: `src/index.ts`

**Step 1: Create src/index.ts**

```typescript
import { parseConfig } from './config/environment.js';
import { setupServer } from './server/setup.js';
import * as logger from './utils/logger.js';
import { setLogLevel } from './utils/logger.js';

const config = parseConfig();
setLogLevel(config.logLevel);

let isShuttingDown = false;

async function shutdown(): Promise<void> {
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
```

**Step 2: Commit**

```bash
git add src/index.ts
git commit -m "feat: add entry point with config parsing and signal handlers"
```

---

### Task 8: Create the CLI entry point

**Files:**
- Create: `bin/cli.js`

**Step 1: Create bin/cli.js**

```javascript
#!/usr/bin/env node

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { spawnSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const args = process.argv.slice(2);

const helpText = `
Kontra — The Tenth Man Protocol
"If nine agree, I disagree."

Structured contrarian analysis for decision-makers via MCP.

Usage:
  kontra-mcp [options]

Options:
  --help, -h         Show this help message
  --version, -v      Show version number

Environment Variables:
  KONTRA_DEFAULT_MODE    Default analysis mode (counter|probe|redteam|premortem). Default: counter
  KONTRA_LOG_LEVEL       Log verbosity (debug|info|warn|error). Default: info

Modes:
  counter    (Free)  Strongest possible argument against your decision
  probe      (Pro)   Uncomfortable questions that expose reasoning gaps
  redteam    (Pro)   Concrete failure scenarios with likelihood estimates
  premortem  (Pro)   Future failure narrative using Gary Klein's technique

Learn more: https://github.com/bluwork/kontra-mcp
`;

if (args.includes('--help') || args.includes('-h')) {
  console.log(helpText);
  process.exit(0);
}

if (args.includes('--version') || args.includes('-v')) {
  try {
    const packageJsonPath = join(__dirname, '..', 'package.json');
    const packageJson = await import(packageJsonPath, { with: { type: 'json' } });
    console.log(`Kontra MCP v${packageJson.default.version}`);
    process.exit(0);
  } catch (error) {
    console.error(
      'Could not determine version:',
      error instanceof Error ? error.message : String(error)
    );
    process.exit(1);
  }
}

const filteredArgs = args.filter((arg) => !['--help', '-h', '--version', '-v'].includes(arg));

const serverPath = join(__dirname, '..', 'dist', 'index.js');
const nodeProcess = spawnSync('node', [serverPath, ...filteredArgs], {
  stdio: 'inherit',
  shell: process.platform === 'win32',
});

process.exit(nodeProcess.status || 0);
```

**Step 2: Make it executable**

Run: `chmod +x bin/cli.js`

**Step 3: Commit**

```bash
git add bin/cli.js
git commit -m "feat: add CLI entry point with help and version flags"
```

---

### Task 9: Build and verify

**Step 1: Build the project**

Run: `cd /home/blu/development/copilot-mcp/kontra-mcp && npm run build`
Expected: TypeScript compiles to dist/ with no errors

**Step 2: Verify help output**

Run: `node bin/cli.js --help`
Expected: Help text with Kontra branding and mode descriptions

**Step 3: Verify version output**

Run: `node bin/cli.js --version`
Expected: `Kontra MCP v0.1.0`

**Step 4: Fix any compilation errors**

If tsc reports errors, fix them in the relevant source files and rebuild.

**Step 5: Commit (if any fixes were needed)**

```bash
git add -A
git commit -m "fix: resolve build issues"
```

---

### Task 10: Create README.md

**Files:**
- Create: `README.md`

**Step 1: Create README.md**

Write a README with these sections:
- Title with tagline: "If nine agree, I disagree."
- One-paragraph description referencing the Tenth Man Doctrine
- Quick Start (npm install, MCP client config for Claude Desktop / Claude Code)
- Usage example showing the tool call and expected output
- Modes table (counter free, others Pro)
- Configuration (env vars)
- License (MIT)

The MCP client config example for Claude Desktop should look like:

```json
{
  "mcpServers": {
    "kontra": {
      "command": "npx",
      "args": ["-y", "kontra-mcp"]
    }
  }
}
```

And for Claude Code:

```bash
claude mcp add kontra -- npx -y kontra-mcp
```

**Step 2: Commit**

```bash
git add README.md
git commit -m "docs: add README with installation, usage, and mode documentation"
```

---

### Task 11: Manual integration test

**Step 1: Add kontra-mcp to Claude Code session**

Run: `claude mcp add kontra -- node /home/blu/development/copilot-mcp/kontra-mcp/dist/index.js`

Or test directly by restarting Claude Code with the MCP server configured.

**Step 2: Test counter mode**

Call the kontra tool with:
```
statement: "I plan to quit consulting and focus 100% on MCP tools for the next 3 months."
context: "Currently earning €5,400/month from consulting. Have dependents. MCP ecosystem is growing but early."
```

Expected: The tool returns the adversarial prompt, and the LLM processes it to produce a structured contrarian analysis with blind spots, assumptions, counter-arguments, and what-if scenarios.

**Step 3: Test Pro mode gating**

Call the kontra tool with:
```
statement: "Test statement"
mode: "premortem"
```

Expected: Returns a message about Pre-Mortem being available in Kontra Pro.

**Step 4: Test with empty context**

Call the kontra tool with:
```
statement: "We should rewrite our backend in Rust"
```

Expected: Counter mode analysis without a context section.

**Step 5: Commit docs/plans**

```bash
git add docs/
git commit -m "docs: add design document and implementation plan"
```
