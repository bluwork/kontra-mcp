# Kontra

### The Tenth Man Protocol

> *"If nine agree, I disagree."*

An MCP tool that stress-tests your decisions with structured contrarian analysis — so blind spots surface before consequences do.

[![npm](https://img.shields.io/npm/v/kontra-mcp)](https://www.npmjs.com/package/kontra-mcp) [![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

## What You Get

You say:

> *"Use kontra to challenge this: We should rewrite our backend from Node.js to Rust. Context: Current stack is Node.js, team of 3, shipping weekly."*

Kontra returns:

---

### BLIND SPOTS

- **You're measuring the cost of rewriting but not the cost of pausing.** A team of 3 shipping weekly has momentum. The rewrite doesn't just cost engineering hours — it costs 3-6 months of feature development, customer feedback loops, and market positioning that your competitors won't pause for.

- **Rust's safety guarantees solve problems you may not have.** If your Node.js backend isn't failing due to memory bugs or concurrency issues, you're optimizing for a class of problems that isn't hurting you. The rewrite is a solution — what's the problem it solves that your team is actually experiencing?

- **The team's Rust proficiency is unproven at production scale.** Writing Rust that compiles is not the same as writing Rust that ships. Borrow checker fluency, async runtime decisions (Tokio vs. async-std), ecosystem maturity for your specific domain — these are all unknowns that compound under deadline pressure.

### HIDDEN ASSUMPTIONS
...

### THE STRONGEST COUNTER-ARGUMENT
...

### WHAT-IF SCENARIOS
...

---

That's `counter` mode — the default. There are three more.

## Quick Start

### Claude Code

```bash
claude mcp add kontra -- npx -y kontra-mcp
```

Then ask: *"Use kontra to analyze my decision to..."*

<details>
<summary>Claude Desktop</summary>

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

</details>

<details>
<summary>Cursor / VS Code</summary>

Add to your MCP settings:

```json
{
  "kontra": {
    "command": "npx",
    "args": ["-y", "kontra-mcp"]
  }
}
```

</details>

## Modes

### `counter` — The Tenth Man

> *"Consensus is never to be mistaken for correctness."*

The default. Assumes your decision is wrong and builds the strongest possible case against it.

**Produces:** Blind Spots, Hidden Assumptions, The Strongest Counter-Argument, What-If Scenarios

**Best for:** Major decisions where you need someone to steelman the opposing side. Architecture choices, strategy pivots, hiring plans, product bets.

---

### `probe` — The Interrogator

> *"A good question does more damage to a bad decision than any argument ever could."*

Asks 7-10 pointed questions across five lenses — no answers, no analysis, just the questions you haven't asked yourself.

**Produces:** Questions across Motivation, Evidence, Alternatives, Stakes, and Timing

**Best for:** Early-stage decisions where you suspect your reasoning has gaps but aren't sure where. Forces you to confront what you've skipped over.

---

### `redteam` — The Red Team Commander

> *"Think like an adversary — not a hypothetical one, but a specific, intelligent opponent who wants this decision to fail."*

Constructs 3-5 concrete failure scenarios with likelihood ratings, trigger events, cascade sequences, early warning signs, and mitigations.

**Produces:** Ranked failure scenarios with likelihood estimates, plus an Overall Vulnerability Assessment (1-10 scale)

**Best for:** Plans that are already in motion. Launch timelines, migration strategies, organizational changes — anything where you need to know exactly how it breaks.

---

### `premortem` — The Postmortem From the Future

> *"Prospective hindsight increases the ability to identify reasons for future outcomes by 30%."*

Imagines the decision was made 12 months ago and failed catastrophically. Writes the full postmortem.

**Produces:** Executive Summary, What Happened (Failure Narrative), Timeline, Root Causes, Signals We Missed, Lessons Learned

**Best for:** High-stakes, hard-to-reverse decisions. Useful when the team is confident and you need to break the spell of inevitability.

## Usage

**Counter a strategy decision:**

> *"Use kontra to challenge this: We're going all-in on AI agents for our product roadmap."*

**Probe a career move:**

> *"Use kontra in probe mode to question my decision to leave my job and start a SaaS company. Context: I have 8 months of runway, no co-founder, and a B2B idea with 3 LOIs."*

**Red team a launch plan:**

> *"Use kontra in redteam mode against our plan to launch in 6 weeks. Context: We have no staging environment, 40% test coverage, and one DevOps engineer."*

**Pre-mortem a hiring decision:**

> *"Use kontra in premortem mode on: We're hiring 5 junior engineers instead of 2 seniors. Context: Current team is 4 seniors, shipping velocity is the bottleneck."*

### Tool Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `statement` | string | Yes | The decision, plan, or conclusion to analyze |
| `context` | string | No | Additional background, constraints, or data |
| `mode` | enum | No | `counter` (default), `probe`, `redteam`, or `premortem` |

## What This Is NOT

- **Not a pros-and-cons generator.** Kontra doesn't weigh both sides. It attacks one side — yours — with full force.
- **Not a risk assessment framework.** No probability matrices or color-coded dashboards. Structured argumentation, not bureaucratic process.
- **Not a generic "be careful" warning.** Every output is specific to your decision and context. No boilerplate applies-to-anything advice.
- **Not a replacement for human judgment.** Kontra surfaces what you might miss. You still decide.

## How It Works

Kontra uses the **prompt-return pattern**. When called, it constructs a carefully engineered adversarial prompt and returns it as the tool response. Your MCP client's own LLM processes the prompt and produces the analysis.

- **No API keys needed** — uses your client's existing LLM
- **No additional network calls** — prompt is returned, not executed
- **Works with any MCP client** — Claude Desktop, Claude Code, Cursor, VS Code

Analysis quality scales with model capability. Stronger models produce sharper, more specific contrarian analysis.

## Configuration

| Environment Variable | Default | Description |
|---------------------|---------|-------------|
| `KONTRA_DEFAULT_MODE` | `counter` | Default analysis mode |
| `KONTRA_LOG_LEVEL` | `info` | Log verbosity (`debug` \| `info` \| `warn` \| `error`) |

## License

MIT
