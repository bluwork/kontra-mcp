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
