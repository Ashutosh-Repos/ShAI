# ShAI CLI Reference

Complete reference for all ShAI CLI commands.

---

## Quick Reference

| Command | Description |
|---------|-------------|
| `shai <query>` | Convert natural language to shell command |
| `shai <shortcut> [args]` | Execute a saved shortcut |
| `shai --auth` | Configure AI provider |
| `shai --config` | View current configuration |
| `shai --model` | Change AI model |
| `shai --shortcuts` | List all shortcuts |
| `shai --add-shortcut` | Add a new shortcut |
| `shai --remove-shortcut <name>` | Remove a shortcut |
| `shai --edit-shortcuts` | Edit shortcuts in editor |
| `shai --history` | View command history |
| `shai --stats` | View usage statistics |
| `shai --clear-history` | Clear command history |
| `shai --suggest-shortcuts` | Get shortcut suggestions |
| `shai --help` | Show help |
| `shai --version` | Show version |

---

## Core Commands

### `shai <query>` - Natural Language to Command

Convert natural language queries into shell commands.

```bash
shai find all files larger than 100mb
shai kill whatever is running on port 3000
shai show disk usage sorted by size
shai undo the last git commit
```

**Output:**
```
  > find . -size +100M -type f

  ? Execute? (y/n/e/c/edit)
```

### Confirmation Options

When prompted `Execute? (y/n/e/c/edit)`:

| Input | Action |
|-------|--------|
| `y` or `Enter` | Execute the command |
| `n` | Cancel and exit |
| `e` | Explain what the command does (AI-powered) |
| `c` | Copy command to clipboard |
| `edit` | Open in editor to modify before executing |

### `shai <shortcut> [args]` - Run Shortcuts

Execute saved shortcuts with optional arguments.

```bash
shai killport 3000
shai commit "my commit message"
shai dev myproject
```

**Output:**
```
  [shortcut: killport]
  > lsof -ti:3000 | xargs kill -9

  ? Execute? (y/n/e/c/edit)
```

---

## Configuration Commands

### `shai --auth`

Configure AI provider and credentials. Interactive setup wizard.

```bash
shai --auth
```

**Supported Providers:**

| Provider | Auth Method | Models |
|----------|-------------|--------|
| Claude (Anthropic) | API Key | claude-sonnet-4, claude-3-5-sonnet, claude-3-5-haiku |
| OpenAI | API Key | gpt-4o, gpt-4o-mini, gpt-4-turbo |
| Ollama | Local (no auth) | Any installed model |
| OpenRouter | API Key | claude-sonnet-4, gpt-4o, gemini-pro, llama-3.1 |

**Flow:**
1. Select provider
2. Enter API key (or configure local host for Ollama)
3. Select model
4. Credentials validated automatically
5. Configuration saved to `~/.shai/config.json`

### `shai --config`

View current configuration.

```bash
shai --config
```

**Output:**
```
  ShAI Configuration

  Provider:  claude
  Model:     claude-sonnet-4-20250514

  Config: ~/.shai/config.json
```

### `shai --model`

Change AI model within current provider.

```bash
shai --model
```

Opens interactive model selector showing available models for your configured provider.

---

## Shortcuts Commands

### `shai --shortcuts`

List all configured shortcuts in a table format.

```bash
shai --shortcuts
```

**Output:**
```
  Your Shortcuts

  ┌──────────┬─────────────────────────────────────────┬──────────────┐
  │ Name     │ Template                                │ Arguments    │
  ├──────────┼─────────────────────────────────────────┼──────────────┤
  │ killport │ lsof -ti:{{port}} | xargs kill -9       │ port         │
  │ commit   │ git add . && git commit -m "{{message}}"│ message      │
  │ dev      │ cd ~/projects/{{project}} && npm run dev│ project      │
  └──────────┴─────────────────────────────────────────┴──────────────┘

  Total: 3 shortcuts
```

### `shai --add-shortcut`

Add a new shortcut.

**Interactive mode:**
```bash
shai --add-shortcut
```

Prompts for:
1. Shortcut name
2. Command template (use `{{arg}}` for placeholders)
3. Argument names (comma-separated)
4. Description (optional)

**One-liner mode:**
```bash
shai --add-shortcut <name> "<template>" [args...]
```

**Examples:**
```bash
# No arguments
shai --add-shortcut disk "df -h"

# Single argument
shai --add-shortcut killport "lsof -ti:{{port}} | xargs kill -9" port

# Multiple arguments
shai --add-shortcut deploy "cd ~/projects/{{project}} && git push {{remote}}" project remote
```

### `shai --remove-shortcut <name>`

Remove a shortcut by name.

```bash
shai --remove-shortcut killport
```

Asks for confirmation before removing.

### `shai --edit-shortcuts`

Open shortcuts file in your default editor.

```bash
shai --edit-shortcuts
```

Opens `~/.shai/shortcuts.json` in `$EDITOR` (falls back to nano/notepad).

---

## History & Statistics Commands

### `shai --history`

View command history in a table format.

```bash
shai --history                    # View recent 20 entries
shai --history --limit 50         # View more entries
shai --history -l 10              # Short form
shai --history --search git       # Search history
shai --history -s commit          # Short form search
```

**Options:**

| Option | Short | Description |
|--------|-------|-------------|
| `--limit` | `-l` | Number of entries to show (default: 20) |
| `--search` | `-s` | Search term to filter by query or command |

**Output:**
```
  Command History

  ┌───┬─────────────────────────────────────┬──────────┬────────────┐
  │ # │ Command                             │ Source   │ Time       │
  ├───┼─────────────────────────────────────┼──────────┼────────────┤
  │ 1 │ find . -size +100M -type f          │ ai       │ 2h ago     │
  │ 2 │ lsof -ti:3000 | xargs kill -9       │ shortcut │ 3h ago     │
  │ 3 │ git add . && git commit -m "..."    │ shortcut │ 5h ago     │
  └───┴─────────────────────────────────────┴──────────┴────────────┘

  Showing 3 of 47 entries
```

**Status Indicators:**
- `✓` - Command executed successfully (exit code 0)
- `✗ exit:N` - Command failed with exit code N
- `○` - Command was not executed (skipped)

### `shai --stats`

View usage statistics.

```bash
shai --stats
```

**Output:**
```
  ShAI Usage Statistics

  Overview
  ┌──────────────────────┬───────────────┐
  │ Metric               │         Value │
  ├──────────────────────┼───────────────┤
  │ Commands Generated   │           156 │
  │ Executed             │     142 (91%) │
  │ Today                │            12 │
  │ This Week            │            45 │
  └──────────────────────┴───────────────┘

  Source Breakdown
  ┌───────────────┬───────┬────────────┐
  │ Source        │ Count │ Percentage │
  ├───────────────┼───────┼────────────┤
  │ AI Generated  │   120 │        77% │
  │ Shortcuts     │    36 │        23% │
  └───────────────┴───────┴────────────┘

  Most Used Commands
  ┌───┬─────────────────────────────────┬──────┬──────────┐
  │ # │ Command                         │ Uses │   Source │
  ├───┼─────────────────────────────────┼──────┼──────────┤
  │ 1 │ lsof -ti:3000 | xargs kill -9   │   23 │ shortcut │
  │ 2 │ git status                      │   18 │       ai │
  │ 3 │ docker ps -a                    │   15 │       ai │
  └───┴─────────────────────────────────┴──────┴──────────┘
```

### `shai --clear-history`

Clear command history.

```bash
shai --clear-history --all           # Clear all history (with confirmation)
shai --clear-history -a              # Short form
shai --clear-history --older-than 7  # Clear entries older than 7 days
shai --clear-history -o 30           # Short form
```

**Options:**

| Option | Short | Description |
|--------|-------|-------------|
| `--all` | `-a` | Clear all history entries |
| `--older-than` | `-o` | Clear entries older than N days |

### `shai --suggest-shortcuts`

Get personalized shortcut suggestions based on frequently used commands.

```bash
shai --suggest-shortcuts              # Default threshold: 3+ uses
shai --suggest-shortcuts --threshold 5  # Higher threshold
shai --suggest-shortcuts -t 2         # Lower threshold
```

**Options:**

| Option | Short | Description |
|--------|-------|-------------|
| `--threshold` | `-t` | Minimum use count to suggest (default: 3) |

**Output:**
```
  Suggested Shortcuts

  Based on your usage patterns:

  Command: lsof -ti:3000 | xargs kill -9
  Used: 8 times
  Suggested name: killport

  ? Create shortcut "killport"? (y/n/e)
```

**Confirmation options:**
- `y` - Create the shortcut
- `n` - Skip this suggestion
- `e` - Exit suggestions

---

## Utility Commands

### `shai --help`

Show help with all available commands.

```bash
shai --help
```

### `shai --version`

Show ShAI version.

```bash
shai --version
```

---

## Configuration Files

All configuration stored in `~/.shai/`:

| File | Purpose |
|------|---------|
| `config.json` | AI provider settings, credentials, preferences |
| `shortcuts.json` | User-defined shortcuts |
| `history.db` | Command history and usage stats (SQLite) |

### Settings in config.json

Customizable settings in `~/.shai/config.json`:

```json
{
  "version": 1,
  "provider": "claude",
  "model": "claude-sonnet-4-20250514",
  "credentials": {
    "type": "api_key",
    "apiKey": "sk-ant-..."
  },
  "settings": {
    "confirmBeforeExecute": true,
    "historyEnabled": true,
    "historyRetentionDays": 30,
    "historyMaxEntries": 2000,
    "autoConfirmShortcuts": false
  }
}
```

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `confirmBeforeExecute` | boolean | `true` | Require confirmation before running commands |
| `historyEnabled` | boolean | `true` | Track command history |
| `historyRetentionDays` | number | `30` | Days to keep history before auto-cleanup |
| `historyMaxEntries` | number | `2000` | Maximum history entries to retain |
| `autoConfirmShortcuts` | boolean | `false` | Skip confirmation for shortcuts (dangerous commands still prompt) |

---

## Shortcut File Format

Example `~/.shai/shortcuts.json`:

```json
{
  "version": 1,
  "shortcuts": {
    "killport": {
      "template": "lsof -ti:{{port}} | xargs kill -9",
      "args": ["port"],
      "description": "Kill process on port"
    },
    "commit": {
      "template": "git add . && git commit -m \"{{message}}\"",
      "args": ["message"],
      "description": "Stage all and commit"
    },
    "dev": {
      "template": "cd ~/projects/{{project}} && npm run dev",
      "args": ["project"],
      "description": "Start dev server"
    }
  }
}
```

### Placeholder Syntax

Use `{{name}}` for dynamic arguments in templates.

**Single argument shortcut:**
```bash
shai killport 3000
# Expands to: lsof -ti:3000 | xargs kill -9
```

**Multi-word single argument:**
```bash
shai commit "fixed the navbar bug"
# Expands to: git add . && git commit -m "fixed the navbar bug"
```

**Missing arguments:**
If required arguments aren't provided, ShAI prompts for them interactively.
