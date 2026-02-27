import { describe, it, expect } from 'vitest';
import { buildRedteamPrompt } from '../../src/prompts/redteam.js';

describe('buildRedteamPrompt', () => {
  const statement = 'We should migrate our database from Postgres to MongoDB';

  it('includes the Red Team Mode header', () => {
    const prompt = buildRedteamPrompt(statement);
    expect(prompt).toContain('[KONTRA — Red Team Mode: Adversarial Threat Assessment]');
  });

  it('includes the Red Team Commander identity framing', () => {
    const prompt = buildRedteamPrompt(statement);
    expect(prompt).toContain('You are now the Red Team Commander');
  });

  it('includes the statement in the output', () => {
    const prompt = buildRedteamPrompt(statement);
    expect(prompt).toContain(`"${statement}"`);
  });

  it('includes all scenario components', () => {
    const prompt = buildRedteamPrompt(statement);
    expect(prompt).toContain('SCENARIO NAME');
    expect(prompt).toContain('LIKELIHOOD');
    expect(prompt).toContain('TRIGGER EVENT');
    expect(prompt).toContain('CASCADE SEQUENCE');
    expect(prompt).toContain('EARLY WARNING SIGNS');
    expect(prompt).toContain('RECOMMENDED MITIGATION');
  });

  it('includes likelihood scale definitions', () => {
    const prompt = buildRedteamPrompt(statement);
    expect(prompt).toContain('Low');
    expect(prompt).toContain('Medium');
    expect(prompt).toContain('High');
    expect(prompt).toContain('Near-Certain');
  });

  it('includes overall vulnerability assessment', () => {
    const prompt = buildRedteamPrompt(statement);
    expect(prompt).toContain('OVERALL VULNERABILITY ASSESSMENT');
    expect(prompt).toContain('1-10');
  });

  it('includes anti-reassurance rules', () => {
    const prompt = buildRedteamPrompt(statement);
    expect(prompt).toContain('Do not provide reassurance');
  });

  it('requires real-world parallels', () => {
    const prompt = buildRedteamPrompt(statement);
    expect(prompt).toContain('real-world parallels');
  });

  it('omits context block when no context provided', () => {
    const prompt = buildRedteamPrompt(statement);
    expect(prompt).not.toContain('CONTEXT PROVIDED BY THE DECISION-MAKER');
  });

  it('includes context block when context is provided', () => {
    const context = '500GB database, 3 engineers, 2 week migration window';
    const prompt = buildRedteamPrompt(statement, context);
    expect(prompt).toContain('CONTEXT PROVIDED BY THE DECISION-MAKER');
    expect(prompt).toContain(context);
  });

  it('handles empty string statement', () => {
    const prompt = buildRedteamPrompt('');
    expect(prompt).toContain('DECISION UNDER ATTACK');
    expect(prompt).toContain('""');
  });

  it('handles statement with special characters', () => {
    const special = 'Use "quotes" and $variables and `backticks`';
    const prompt = buildRedteamPrompt(special);
    expect(prompt).toContain(special);
  });
});
