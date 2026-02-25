# Kontra Core Design Document

**Date:** 2026-02-25
**Author:** Boban Lukic + Claude
**Status:** Approved

## Overview

Kontra Core is an open-source MCP tool that provides structured contrarian analysis for decision-makers. Inspired by the Tenth Man Doctrine, it ensures every decision receives adversarial scrutiny.

Phase 1 ships counter mode only. Probe, red team, and pre-mortem modes return a "Kontra Pro" upgrade message.

## Architecture Decision: Prompt-Return Pattern

Kontra does **not** call any external LLM API. Instead, it constructs a carefully engineered adversarial prompt and returns it as the MCP tool response. The client's own LLM processes the prompt and produces the contrarian analysis.

**Rationale:**
- Zero external dependencies (no API keys, no LLM SDK)
- Instant response (no network calls beyond the client's own)
- Works with any MCP client (Claude Desktop, Cursor, VS Code, Claude Code)
- Core IP is the prompt engineering, not the infrastructure

## Project Structure

```
kontra-mcp/
├── src/
│   ├── index.ts              # Entry point: parse config, setup server, signal handlers
│   ├── types.ts              # TypeScript interfaces
│   ├── server/
│   │   └── setup.ts          # MCP server creation, tool registration, stdio transport
│   ├── tools/
│   │   └── kontra.ts         # The single 'kontra' tool
│   ├── prompts/
│   │   ├── counter.ts        # Counter mode system prompt (Phase 1 — active)
│   │   ├── probe.ts          # Probe mode prompt (placeholder)
│   │   ├── redteam.ts        # Red team prompt (placeholder)
│   │   └── premortem.ts      # Pre-mortem prompt (placeholder)
│   ├── config/
│   │   └── environment.ts    # CLI arg parsing, env var config
│   └── utils/
│       └── logger.ts         # Simple stderr logger
├── bin/
│   └── cli.js                # Executable entry point
├── package.json
├── tsconfig.json
└── README.md
```

Follows conventions from mongo-scout-mcp and postgres-scout-mcp.

## Tool Schema

Single MCP tool named `kontra`:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| statement | string | Yes | The decision, plan, or conclusion to analyze |
| context | string | No | Additional background, constraints, or data |
| mode | enum | No | counter (default), probe, redteam, premortem |

## Tool Flow

1. Validate input via Zod schema
2. Check mode — if not `counter`, return Kontra Pro upgrade message
3. Select prompt template for the mode
4. Interpolate statement and context into the template
5. Return adversarial analysis prompt as tool response text

## Output Format

The LLM decides the output format naturally. The prompt guides toward structured sections (blind spots, assumptions, counter-arguments, failure scenarios) but does not enforce JSON or specific formatting.

## Configuration

| Env Variable | Default | Description |
|---|---|---|
| KONTRA_DEFAULT_MODE | counter | Default analysis mode |
| KONTRA_LOG_LEVEL | info | Logging verbosity |

## Dependencies

- `@modelcontextprotocol/sdk` — MCP server framework
- `zod` — Input validation

No LLM SDK. No database. No external API calls.

## Distribution

- npm package: `kontra-mcp`
- bin: `kontra-mcp` CLI command
- MCP marketplace submissions: Glama.ai, Smithery.ai
