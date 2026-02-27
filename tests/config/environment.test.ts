import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { parseConfig } from '../../src/config/environment.js';

describe('parseConfig', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
    delete process.env.KONTRA_DEFAULT_MODE;
    delete process.env.KONTRA_LOG_LEVEL;
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('returns defaults when no env vars set', () => {
    const config = parseConfig();
    expect(config.defaultMode).toBe('counter');
    expect(config.logLevel).toBe('info');
  });

  it('reads KONTRA_DEFAULT_MODE from env', () => {
    process.env.KONTRA_DEFAULT_MODE = 'probe';
    const config = parseConfig();
    expect(config.defaultMode).toBe('probe');
  });

  it('reads KONTRA_LOG_LEVEL from env', () => {
    process.env.KONTRA_LOG_LEVEL = 'debug';
    const config = parseConfig();
    expect(config.logLevel).toBe('debug');
  });

  it('falls back to counter for invalid mode', () => {
    process.env.KONTRA_DEFAULT_MODE = 'invalid';
    const stderrSpy = vi.spyOn(process.stderr, 'write').mockImplementation(() => true);
    const config = parseConfig();
    expect(config.defaultMode).toBe('counter');
    expect(stderrSpy).toHaveBeenCalledWith(expect.stringContaining('Invalid KONTRA_DEFAULT_MODE'));
    stderrSpy.mockRestore();
  });

  it('falls back to info for invalid log level', () => {
    process.env.KONTRA_LOG_LEVEL = 'verbose';
    const stderrSpy = vi.spyOn(process.stderr, 'write').mockImplementation(() => true);
    const config = parseConfig();
    expect(config.logLevel).toBe('info');
    expect(stderrSpy).toHaveBeenCalledWith(expect.stringContaining('Invalid KONTRA_LOG_LEVEL'));
    stderrSpy.mockRestore();
  });
});
