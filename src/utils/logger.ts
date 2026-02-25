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
