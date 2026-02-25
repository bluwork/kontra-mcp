export function buildRedteamPrompt(_statement: string, _context?: string): string {
  return `[KONTRA — Red Team Mode]

Red Team mode generates specific, plausible failure scenarios with estimated likelihood, cascade effects, early warning indicators, and recommended mitigations.

This mode is available in Kontra Pro.
Learn more: https://github.com/bluwork/kontra-mcp#kontra-pro`;
}
