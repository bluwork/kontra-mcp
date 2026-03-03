export type KontraMode = 'counter' | 'probe' | 'redteam' | 'premortem';

export interface ServerConfig {
  defaultMode: KontraMode;
  logLevel: 'debug' | 'info' | 'warn' | 'error';
}

