#!/usr/bin/env node

import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const require = createRequire(import.meta.url);

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
  counter    Strongest possible argument against your decision
  probe      Uncomfortable questions that expose reasoning gaps
  redteam    Concrete failure scenarios with likelihood estimates
  premortem  Future failure narrative using prospective hindsight

Learn more: https://github.com/bluwork/kontra-mcp
`;

if (args.includes('--help') || args.includes('-h')) {
  console.log(helpText);
  process.exit(0);
}

if (args.includes('--version') || args.includes('-v')) {
  try {
    const packageJson = require('../package.json');
    console.log(`Kontra MCP v${packageJson.version}`);
    process.exit(0);
  } catch (error) {
    console.error(
      'Could not determine version:',
      error instanceof Error ? error.message : String(error)
    );
    process.exit(1);
  }
}

const serverPath = join(__dirname, '..', 'dist', 'index.js');
const nodeProcess = spawnSync('node', [serverPath], {
  stdio: 'inherit',
});

if (nodeProcess.error) {
  process.stderr.write(
    `kontra-mcp: failed to start server: ${nodeProcess.error.message}\n`
  );
  process.exit(1);
}

process.exit(nodeProcess.status ?? 1);
