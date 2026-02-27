import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as logger from '../../src/utils/logger.js';

describe('logger', () => {
  let stderrSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    stderrSpy = vi.spyOn(process.stderr, 'write').mockImplementation(() => true);
    logger.setLogLevel('debug');
  });

  it('writes to stderr, not stdout', () => {
    const stdoutSpy = vi.spyOn(process.stdout, 'write').mockImplementation(() => true);
    logger.info('test message');
    expect(stderrSpy).toHaveBeenCalled();
    expect(stdoutSpy).not.toHaveBeenCalled();
    stdoutSpy.mockRestore();
  });

  it('includes level label in output', () => {
    logger.error('something broke');
    const output = (stderrSpy.mock.calls[0]?.[0] as string) ?? '';
    expect(output).toContain('[ERROR]');
    expect(output).toContain('something broke');
  });

  it('includes ISO timestamp', () => {
    logger.info('timestamped');
    const output = (stderrSpy.mock.calls[0]?.[0] as string) ?? '';
    expect(output).toMatch(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
  });

  it('includes JSON data when provided', () => {
    logger.info('with data', { key: 'value' });
    const output = (stderrSpy.mock.calls[0]?.[0] as string) ?? '';
    expect(output).toContain('{"key":"value"}');
  });

  it('respects log level filtering', () => {
    logger.setLogLevel('error');
    logger.debug('should not appear');
    logger.info('should not appear');
    logger.warn('should not appear');
    expect(stderrSpy).not.toHaveBeenCalled();

    logger.error('should appear');
    expect(stderrSpy).toHaveBeenCalledTimes(1);
  });
});
