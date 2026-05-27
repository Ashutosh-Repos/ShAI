<p align="center">
  <a href="https://github.com/Ashutosh-Repos/ShAI">
    <img src="https://res.cloudinary.com/da8wropwc/image/upload/v1779894432/shai_u3jmfj.png" alt="ShAI" width="100%" />
  </a>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/shai-shell"><img src="https://img.shields.io/npm/v/shai-shell.svg" alt="npm" /></a>
  <a href="https://github.com/Ashutosh-Repos/ShAI/blob/main/LICENSE"><img src="https://img.shields.io/badge/License-Apache%202.0-blue.svg" alt="License" /></a>
  <a href="https://github.com/Ashutosh-Repos/ShAI"><img src="https://img.shields.io/github/stars/Ashutosh-Repos/ShAI?style=social" alt="Stars" /></a>
</p>

<h1 align="center">ShAI</h1>

<p align="center">
  <strong>Natural language to shell commands. Stop Googling, start doing.</strong>
</p>

---

## Quick Start

```bash
npm i -g shai-shell    # Install globally from npm
shai --auth            # Setup your AI provider
shai show disk usage   # Start using!
```

Requires Node.js 20.12.0+

---

## What is ShAI?

ShAI converts plain English into shell commands. Describe what you want, review the command, then execute.

```bash
$ shai find all files larger than 100mb and delete them
```

```
  > find . -size +100M -type f -delete

  ? Execute? (y/n/e/c/edit)
```

**Options:** `y` execute · `n` cancel · `e` explain · `c` copy · `edit` modify

---

## Examples

```bash
# Files
shai find all javascript files modified today
shai delete all node_modules folders recursively
shai compress all png images in this folder

# Git
shai undo last commit but keep changes
shai show commits from last week by john

# System
shai kill whatever is running on port 3000
shai what is my public ip address
shai list all running docker containers
```

---

## Chat Mode

Full-screen AI chat with streaming responses:

```bash
shai --chat
```

**Features:** Session history · Slash commands · Themes · Model switching

| Shortcut | Action        |
| -------- | ------------- |
| `Ctrl+P` | Switch model  |
| `Ctrl+O` | Open sessions |
| `Ctrl+T` | Change theme  |
| `Ctrl+C` | Exit          |

---

## Shortcuts

Save frequently used commands with placeholders:

```bash
shai --add-shortcut killport "lsof -ti:{{port}} | xargs kill -9" port
shai killport 3000    # Uses the shortcut
```

---

## AI Providers

Configure with `shai --auth`:

| Provider               | Type                             |
| ---------------------- | -------------------------------- |
| **Claude** (Anthropic) | API Key or Pro/Max subscription  |
| **OpenAI** (ChatGPT)   | API Key or Plus/Pro subscription |
| **Google Gemini**      | API Key (Free & Paid tiers)      |
| **GitHub Copilot**     | Free with Copilot subscription   |
| **Ollama**             | Free, runs locally               |
| **OpenRouter**         | Pay-per-use, multiple models     |

Switch anytime: `shai --model`

---

## All Commands

### Core

| Command        | Description                               |
| -------------- | ----------------------------------------- |
| `shai <query>` | Convert natural language to shell command |
| `shai --chat`  | Start interactive AI chat session         |

### Configuration

| Command         | Description                |
| --------------- | -------------------------- |
| `shai --auth`   | Configure AI provider      |
| `shai --config` | View current configuration |
| `shai --model`  | Change AI provider/model   |
| `shai --theme`  | Change color theme         |

### Shortcuts

| Command                         | Description              |
| ------------------------------- | ------------------------ |
| `shai --shortcuts`              | List all shortcuts       |
| `shai --add-shortcut`           | Add a new shortcut       |
| `shai --remove-shortcut <name>` | Remove a shortcut        |
| `shai --edit-shortcuts`         | Edit shortcuts in editor |

### History & Stats

| Command                          | Description                    |
| -------------------------------- | ------------------------------ |
| `shai --history`                 | View command history           |
| `shai --history --search <term>` | Search history                 |
| `shai --stats`                   | View usage statistics          |
| `shai --suggest-shortcuts`       | Suggest shortcuts from history |
| `shai --clear-history`           | Clear command history          |

### Help

| Command          | Description                      |
| ---------------- | -------------------------------- |
| `shai --help`    | Show help message                |
| `shai --version` | Show version (with update check) |

---

## Safety

ShAI warns you about dangerous commands:

```
  > rm -rf ~/*

  WARNING: This command may cause irreversible changes.
  - Uses recursive force delete (rm -rf)
  - Targets home directory

  ? Proceed? (y/N)
```

Every command requires confirmation before execution.

---

## Privacy

- All data stored locally at `~/.shai/`
- No telemetry or tracking
- Queries only sent to your chosen AI provider

---

## License

Copyright 2026 [Ashutosh](https://github.com/Ashutosh-Repos)

**If you use, modify, or distribute this project, you must:**

1. Give credit to **Ashutosh** as the original author
2. Link to [github.com/Ashutosh-Repos/ShAI](https://github.com/Ashutosh-Repos/ShAI)

Licensed under Apache 2.0 · [View LICENSE](https://github.com/Ashutosh-Repos/ShAI/blob/main/LICENSE)

---

<p align="center">
  <a href="https://github.com/Ashutosh-Repos/ShAI">GitHub</a> · <a href="https://www.npmjs.com/package/shai-shell">npm</a> · <a href="https://github.com/Ashutosh-Repos">Author</a>
</p>
