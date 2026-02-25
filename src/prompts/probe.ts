export function buildProbePrompt(_statement: string, _context?: string): string {
  return `[KONTRA — Probe Mode]

Probe mode asks uncomfortable questions without providing answers. It forces the decision-maker to confront gaps in their own reasoning.

This mode is available in Kontra Pro.
Learn more: https://github.com/bluwork/kontra-mcp#kontra-pro`;
}
