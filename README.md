# Kontra

### The Tenth Man Protocol

> *"If nine agree, I disagree."*

Kontra is an MCP tool that provides structured contrarian analysis for decision-makers. Built on a simple principle — if nine people agree, the tenth is obligated to disagree and investigate — Kontra ensures that every decision receives adversarial scrutiny before execution.

Unlike general-purpose AI assistants that optimize for helpfulness, Kontra is purpose-built to disagree. It identifies blind spots, challenges hidden assumptions, constructs the strongest possible counter-argument, and generates failure scenarios.

## Quick Start

### Claude Code

```bash
claude mcp add kontra -- npx -y kontra-mcp
```

### Claude Desktop

Add to your Claude Desktop config (`~/Library/Application Support/Claude/claude_desktop_config.json` on macOS):

```json
{
  "mcpServers": {
    "kontra": {
      "command": "npx",
      "args": ["-y", "kontra-mcp"]
    }
  }
}
```

### Cursor / VS Code

Add to your MCP settings:

```json
{
  "kontra": {
    "command": "npx",
    "args": ["-y", "kontra-mcp"]
  }
}
```

## Usage

Once installed, ask your AI assistant to use the `kontra` tool:

> "Use kontra to analyze my decision: I plan to quit consulting and focus 100% on MCP tools for the next 3 months."

Or with additional context:

> "Use kontra to challenge this: We should rewrite our backend in Rust. Context: Current stack is Node.js, team of 3, shipping weekly."

## Tool Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `statement` | string | Yes | The decision, plan, or conclusion to analyze |
| `context` | string | No | Additional background, constraints, or data |
| `mode` | enum | No | Analysis mode (default: `counter`) |

## Modes

| Mode | Description |
|------|-------------|
| `counter` | Strongest possible argument against your decision. Identifies blind spots, hidden assumptions, counter-arguments, and failure scenarios. |
| `probe` | Asks uncomfortable questions without answers. Forces you to confront gaps in your reasoning across five lenses: motivation, evidence, alternatives, stakes, and timing. |
| `redteam` | Generates 3-5 concrete failure scenarios with likelihood estimates, trigger events, cascade effects, early warning signs, and mitigations. Includes an overall vulnerability assessment. |
| `premortem` | Prospective hindsight: "It failed. Write the postmortem from the future." Produces a full postmortem with narrative, timeline, root causes, missed signals, and lessons learned. |

## Configuration

| Environment Variable | Default | Description |
|---------------------|---------|-------------|
| `KONTRA_DEFAULT_MODE` | `counter` | Default analysis mode |
| `KONTRA_LOG_LEVEL` | `info` | Log verbosity (`debug` \| `info` \| `warn` \| `error`) |

## How It Works

Kontra uses the **prompt-return pattern**. When called, it constructs a carefully engineered adversarial prompt and returns it as the tool response. Your MCP client's own LLM processes the prompt and produces the contrarian analysis.

This means:
- **No API keys needed** — uses your client's existing LLM
- **Instant response** — no additional network calls
- **Works with any MCP client** — Claude Desktop, Claude Code, Cursor, VS Code

## Why Contrarian Analysis?

When everyone agrees, blind spots thrive. Structured contrarian analysis ensures that every decision is stress-tested before execution — not by pessimism, but by discipline. If nine people reach the same conclusion, the tenth is obligated to assume they are wrong and investigate.

Kontra operationalizes this principle as software.

## License

MIT
