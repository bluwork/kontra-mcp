export function buildPremortemPrompt(_statement: string, _context?: string): string {
  return `[KONTRA — Pre-Mortem Mode]

Pre-Mortem mode applies Gary Klein's prospective hindsight technique: "Imagine it is one year from now and this project has failed catastrophically. Write the postmortem."

This mode is available in Kontra Pro.
Learn more: https://github.com/bluwork/kontra-mcp#kontra-pro`;
}
