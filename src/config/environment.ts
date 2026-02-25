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
