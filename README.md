# ABP Claude Code Plugin

Claude Code plugin for [Agent Browser Protocol](https://github.com/theredsix/agent-browser-protocol) — deterministic AI agent browser control at the engine level.

## Install

Install from the Claude Code marketplace:

```
claude plugin install theredsix/abp-npm
```

Or add manually to your project's `.mcp.json`:

```json
{
  "mcpServers": {
    "browser": {
      "command": "npx",
      "args": ["-y", "agent-browser-protocol", "--mcp"],
      "env": {
        "ABP_HEADLESS": "${ABP_HEADLESS}"
      }
    }
  }
}
```

## What's Included

- **MCP Server** — 13 browser control tools (navigate, click, type, screenshot, etc.)
- **Usage Skill** — Reference guide for all tools, loaded automatically when relevant

## Configuration

| Environment Variable | Description | Default |
|---------------------|-------------|---------|
| `ABP_HEADLESS` | Run browser headless | `""` (visible) |
| `ABP_PORT` | REST API port | `8222` |
| `ABP_BROWSER_PATH` | Custom binary path | auto-detected |

## Links

- [Agent Browser Protocol](https://github.com/theredsix/agent-browser-protocol) — Chromium fork + NPM SDK
- [NPM Package](https://www.npmjs.com/package/agent-browser-protocol) — `npm install agent-browser-protocol`
