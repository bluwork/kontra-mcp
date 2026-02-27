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

