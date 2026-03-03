import { describe, it, expect } from 'vitest';
import { buildCounterPrompt } from '../../src/prompts/counter.js';

describe('buildCounterPrompt', () => {
  const statement = 'We should rewrite everything in Rust';

  it('includes the Tenth Man Protocol header', () => {
    const prompt = buildCounterPrompt(statement);
    expect(prompt).toContain('[KONTRA — The Tenth Man Protocol]');
  });

  it('includes the statement in the output', () => {
    const prompt = buildCounterPrompt(statement);
    expect(prompt).toContain(`"${statement}"`);
  });

  it('includes all four required analysis sections', () => {
    const prompt = buildCounterPrompt(statement);
    expect(prompt).toContain('1. BLIND SPOTS');
    expect(prompt).toContain('2. HIDDEN ASSUMPTIONS');
    expect(prompt).toContain('3. THE STRONGEST COUNTER-ARGUMENT');
    expect(prompt).toContain('4. WHAT-IF SCENARIOS');
  });

  it('includes the Tenth Man identity framing', () => {
    const prompt = buildCounterPrompt(statement);
    expect(prompt).toContain('You are now the Tenth Man');
    expect(prompt).toContain('the tenth is obligated to assume they are wrong');
  });

  it('includes anti-softening rules of engagement', () => {
    const prompt = buildCounterPrompt(statement);
    expect(prompt).toContain('RULES OF ENGAGEMENT');
    expect(prompt).toContain('Do not soften your analysis');
    expect(prompt).toContain('Do not say "this is a good idea, but..."');
  });

  it('includes the closing identity line', () => {
    const prompt = buildCounterPrompt(statement);
    expect(prompt).toContain("I'm not saying you're wrong. I'm obligated to find out if you are.");
  });

  it('omits context block when no context provided', () => {
    const prompt = buildCounterPrompt(statement);
    expect(prompt).not.toContain('CONTEXT PROVIDED BY THE DECISION-MAKER');
  });

  it('includes context block when context is provided', () => {
    const context = 'Team of 3, shipping weekly, Node.js stack';
    const prompt = buildCounterPrompt(statement, context);
    expect(prompt).toContain('CONTEXT PROVIDED BY THE DECISION-MAKER');
    expect(prompt).toContain(context);
  });

  it('handles empty string statement', () => {
    const prompt = buildCounterPrompt('');
    expect(prompt).toContain('DECISION UNDER ANALYSIS');
    expect(prompt).toContain('""');
  });

  it('handles statement with special characters', () => {
    const special = 'Use "quotes" and $variables and `backticks`';
    const prompt = buildCounterPrompt(special);
    expect(prompt).toContain(special);
  });
});
