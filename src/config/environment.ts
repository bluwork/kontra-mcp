import type { ServerConfig, KontraMode } from '../types.js';

const VALID_MODES: KontraMode[] = ['counter', 'probe', 'redteam', 'premortem'];
const VALID_LOG_LEVELS = ['debug', 'info', 'warn', 'error'] as const;

export function parseConfig(): ServerConfig {
  const rawMode = process.env.KONTRA_DEFAULT_MODE || 'counter';
  const rawLogLevel = process.env.KONTRA_LOG_LEVEL || 'info';

  const defaultMode: KontraMode = VALID_MODES.includes(rawMode as KontraMode)
    ? (rawMode as KontraMode)
    : (() => {
        process.stderr.write(
          `[kontra] Invalid KONTRA_DEFAULT_MODE "${rawMode}". Using "counter".\n`
        );
        return 'counter' as const;
      })();

  const logLevel: ServerConfig['logLevel'] = VALID_LOG_LEVELS.includes(rawLogLevel as typeof VALID_LOG_LEVELS[number])
    ? (rawLogLevel as ServerConfig['logLevel'])
    : (() => {
        process.stderr.write(
          `[kontra] Invalid KONTRA_LOG_LEVEL "${rawLogLevel}". Using "info".\n`
        );
        return 'info' as const;
      })();

  return { defaultMode, logLevel };
}
