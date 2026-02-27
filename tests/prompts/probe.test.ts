import { describe, it, expect } from 'vitest';
import { buildProbePrompt } from '../../src/prompts/probe.js';

describe('buildProbePrompt', () => {
  const statement = 'We should pivot from B2B to B2C';

  it('includes the Probe Mode header', () => {
    const prompt = buildProbePrompt(statement);
    expect(prompt).toContain('[KONTRA — Probe Mode: The Uncomfortable Questions]');
  });

  it('includes the Interrogator identity framing', () => {
    const prompt = buildProbePrompt(statement);
    expect(prompt).toContain('You are now the Interrogator');
  });

  it('includes the statement in the output', () => {
    const prompt = buildProbePrompt(statement);
    expect(prompt).toContain(`"${statement}"`);
  });

  it('includes all five question lenses', () => {
    const prompt = buildProbePrompt(statement);
    expect(prompt).toContain('1. MOTIVATION');
    expect(prompt).toContain('2. EVIDENCE');
    expect(prompt).toContain('3. ALTERNATIVES');
    expect(prompt).toContain('4. STAKES');
    expect(prompt).toContain('5. TIMING');
  });

  it('enforces questions-only rule', () => {
    const prompt = buildProbePrompt(statement);
    expect(prompt).toContain('Questions only. No answers, no analysis, no recommendations.');
  });

  it('includes the closing identity line', () => {
    const prompt = buildProbePrompt(statement);
    expect(prompt).toContain("You don't owe me answers. You owe them to yourself.");
  });

  it('omits context block when no context provided', () => {
    const prompt = buildProbePrompt(statement);
    expect(prompt).not.toContain('CONTEXT PROVIDED BY THE DECISION-MAKER');
  });

  it('includes context block when context is provided', () => {
    const context = 'Current revenue is $2M ARR, 50 enterprise customers';
    const prompt = buildProbePrompt(statement, context);
    expect(prompt).toContain('CONTEXT PROVIDED BY THE DECISION-MAKER');
    expect(prompt).toContain(context);
  });

  it('includes anti-softening rules', () => {
    const prompt = buildProbePrompt(statement);
    expect(prompt).toContain('Do not soften questions');
    expect(prompt).toContain('Be direct');
  });

  it('handles empty string statement', () => {
    const prompt = buildProbePrompt('');
    expect(prompt).toContain('DECISION UNDER EXAMINATION');
    expect(prompt).toContain('""');
  });

  it('handles statement with special characters', () => {
    const special = 'Use "quotes" and $variables and `backticks`';
    const prompt = buildProbePrompt(special);
    expect(prompt).toContain(special);
  });
});
