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

const serverPath = join(__dirname, '..', 'dist', 'index.js');
const nodeProcess = spawnSync('node', [serverPath, ...args], {
  stdio: 'inherit',
  shell: process.platform === 'win32',
});

process.exit(nodeProcess.status || 0);
