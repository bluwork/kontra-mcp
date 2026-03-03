import { describe, it, expect } from 'vitest';
import { buildPremortemPrompt } from '../../src/prompts/premortem.js';

describe('buildPremortemPrompt', () => {
  const statement = 'We should raise a Series A and scale the team to 20 people';

  it('includes the Pre-Mortem Mode header', () => {
    const prompt = buildPremortemPrompt(statement);
    expect(prompt).toContain('[KONTRA — Pre-Mortem Mode: The Postmortem From the Future]');
  });

  it('includes the postmortem identity framing', () => {
    const prompt = buildPremortemPrompt(statement);
    expect(prompt).toContain('You are now writing a postmortem');
    expect(prompt).toContain('the failure has already happened');
  });

  it('references prospective hindsight technique', () => {
    const prompt = buildPremortemPrompt(statement);
    expect(prompt).toContain('prospective hindsight');
  });

  it('includes the statement in the output', () => {
    const prompt = buildPremortemPrompt(statement);
    expect(prompt).toContain(`"${statement}"`);
  });

  it('includes all six postmortem sections', () => {
    const prompt = buildPremortemPrompt(statement);
    expect(prompt).toContain('1. EXECUTIVE SUMMARY');
    expect(prompt).toContain('2. WHAT HAPPENED');
    expect(prompt).toContain('3. TIMELINE');
    expect(prompt).toContain('4. ROOT CAUSES');
    expect(prompt).toContain('5. SIGNALS WE MISSED');
    expect(prompt).toContain('6. LESSONS LEARNED');
  });

  it('enforces past-tense writing rule', () => {
    const prompt = buildPremortemPrompt(statement);
    expect(prompt).toContain('Write entirely in past tense');
    expect(prompt).toContain('"We did" not "we might."');
  });

  it('enforces no-hedging rule', () => {
    const prompt = buildPremortemPrompt(statement);
    expect(prompt).toContain('No hedging');
    expect(prompt).toContain('"might have" with "did,"');
  });

  it('enforces no silver linings rule', () => {
    const prompt = buildPremortemPrompt(statement);
    expect(prompt).toContain('No silver linings');
  });

  it('includes the closing identity line', () => {
    const prompt = buildPremortemPrompt(statement);
    expect(prompt).toContain('This postmortem was written so that the next team does not repeat our mistakes.');
  });

  it('omits context block when no context provided', () => {
    const prompt = buildPremortemPrompt(statement);
    expect(prompt).not.toContain('CONTEXT PROVIDED BY THE DECISION-MAKER');
  });

  it('includes context block when context is provided', () => {
    const context = 'Current team of 4, bootstrapped, $500K revenue';
    const prompt = buildPremortemPrompt(statement, context);
    expect(prompt).toContain('CONTEXT PROVIDED BY THE DECISION-MAKER');
    expect(prompt).toContain(context);
  });

  it('frames the decision as 12 months ago', () => {
    const prompt = buildPremortemPrompt(statement);
    expect(prompt).toContain('DECISION THAT WAS MADE (12 MONTHS AGO)');
  });

  it('handles empty string statement', () => {
    const prompt = buildPremortemPrompt('');
    expect(prompt).toContain('DECISION THAT WAS MADE (12 MONTHS AGO)');
    expect(prompt).toContain('""');
  });

  it('handles statement with special characters', () => {
    const special = 'Use "quotes" and $variables and `backticks`';
    const prompt = buildPremortemPrompt(special);
    expect(prompt).toContain(special);
  });
});
