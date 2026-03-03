import { describe, it, expect, vi, beforeEach } from 'vitest';
import { registerKontraTools } from '../../src/tools/kontra.js';
import type { KontraMode } from '../../src/types.js';

// Capture the handler registered with server.tool()
let capturedHandler: (args: Record<string, unknown>) => Promise<unknown>;

const mockServer = {
  tool: vi.fn((_name: string, _description: string, _schema: unknown, handler: (args: Record<string, unknown>) => Promise<unknown>) => {
    capturedHandler = handler;
  }),
} as any;

beforeEach(() => {
  vi.clearAllMocks();
});

describe('registerKontraTools', () => {
  it('registers a tool named "kontra"', () => {
    registerKontraTools(mockServer, 'counter');
    expect(mockServer.tool).toHaveBeenCalledOnce();
    expect(mockServer.tool.mock.calls[0][0]).toBe('kontra');
  });

  it('returns MCP-compliant response shape', async () => {
    registerKontraTools(mockServer, 'counter');
    const result = await capturedHandler({ statement: 'Test decision' }) as any;

    expect(result).toHaveProperty('content');
    expect(Array.isArray(result.content)).toBe(true);
    expect(result.content).toHaveLength(1);
    expect(result.content[0]).toHaveProperty('type', 'text');
    expect(result.content[0]).toHaveProperty('text');
    expect(typeof result.content[0].text).toBe('string');
    expect(result.content[0].text.length).toBeGreaterThan(0);
  });

  it('uses the specified mode when provided', async () => {
    registerKontraTools(mockServer, 'counter');
    const result = await capturedHandler({ statement: 'Test', mode: 'probe' }) as any;

    expect(result.content[0].text).toContain('[KONTRA — Probe Mode');
  });

  it('uses defaultMode when mode is not provided', async () => {
    registerKontraTools(mockServer, 'probe');
    const result = await capturedHandler({ statement: 'Test' }) as any;

    expect(result.content[0].text).toContain('[KONTRA — Probe Mode');
  });

  it('uses defaultMode when mode is undefined', async () => {
    registerKontraTools(mockServer, 'redteam');
    const result = await capturedHandler({ statement: 'Test', mode: undefined }) as any;

    expect(result.content[0].text).toContain('[KONTRA — Red Team Mode');
  });

  it('dispatches all four modes to correct builders', async () => {
    registerKontraTools(mockServer, 'counter');

    const modeHeaders: Record<KontraMode, string> = {
      counter: '[KONTRA — The Tenth Man Protocol]',
      probe: '[KONTRA — Probe Mode',
      redteam: '[KONTRA — Red Team Mode',
      premortem: '[KONTRA — Pre-Mortem Mode',
    };

    for (const [mode, expectedHeader] of Object.entries(modeHeaders)) {
      const result = await capturedHandler({ statement: 'Test', mode }) as any;
      expect(result.content[0].text).toContain(expectedHeader);
    }
  });

  it('includes the statement in the generated prompt', async () => {
    registerKontraTools(mockServer, 'counter');
    const statement = 'We should migrate to microservices';
    const result = await capturedHandler({ statement }) as any;

    expect(result.content[0].text).toContain(statement);
  });

  it('includes context when provided', async () => {
    registerKontraTools(mockServer, 'counter');
    const context = 'Team of 3, Node.js stack';
    const result = await capturedHandler({ statement: 'Test', context }) as any;

    expect(result.content[0].text).toContain(context);
    expect(result.content[0].text).toContain('CONTEXT PROVIDED BY THE DECISION-MAKER');
  });

  it('omits context block when context is not provided', async () => {
    registerKontraTools(mockServer, 'counter');
    const result = await capturedHandler({ statement: 'Test' }) as any;

    expect(result.content[0].text).not.toContain('CONTEXT PROVIDED BY THE DECISION-MAKER');
  });

  it('explicit mode overrides defaultMode', async () => {
    registerKontraTools(mockServer, 'premortem');
    const result = await capturedHandler({ statement: 'Test', mode: 'counter' }) as any;

    expect(result.content[0].text).toContain('[KONTRA — The Tenth Man Protocol]');
    expect(result.content[0].text).not.toContain('Pre-Mortem');
  });
});
