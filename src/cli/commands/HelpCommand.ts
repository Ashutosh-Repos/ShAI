import { Command } from 'clipanion';
import pc from 'picocolors';
import { PACKAGE_VERSION } from '../../core/constants.js';
import { accent, renderTable } from '../../utils/table.js';

export class HelpCommand extends Command {
  static paths = [['help'], ['--help'], ['-h']];

  static usage = Command.Usage({
    description: 'Show help information',
  });

  async execute(): Promise<number> {
    console.log();
    console.log(pc.bold(`  ShAI v${PACKAGE_VERSION}`));
    console.log(pc.dim('  Natural language to shell commands\n'));

    renderTable({
      title: 'Commands',
      columns: [
        { header: 'Command', key: 'command', width: 24, color: accent },
        { header: 'Description', key: 'description', width: 42 },
      ],
      data: [
        // Core
        {
          command: 'shai <query>',
          description: 'Convert natural language to shell commands',
        },
        {
          command: 'shai --chat',
          description: 'Start interactive AI chat session',
        },

        // Configuration
        { command: 'shai --auth', description: 'Configure AI provider' },
        { command: 'shai --config', description: 'View current configuration' },
        { command: 'shai --model', description: 'Change AI provider/model' },
        { command: 'shai --theme', description: 'Change color theme' },

        // Shortcuts
        { command: 'shai --shortcuts', description: 'List all shortcuts' },
        { command: 'shai --add-shortcut', description: 'Add a new shortcut' },
        { command: 'shai --remove-shortcut', description: 'Remove a shortcut' },
        {
          command: 'shai --edit-shortcuts',
          description: 'Edit shortcuts in editor',
        },

        // History & Stats
        { command: 'shai --history', description: 'View command history' },
        { command: 'shai --stats', description: 'View usage statistics' },
        {
          command: 'shai --clear-history',
          description: 'Clear command history',
        },
        {
          command: 'shai --suggest-shortcuts',
          description: 'Suggest shortcuts from history',
        },

        // Help
        { command: 'shai --help', description: 'Show this help message' },
        { command: 'shai --version', description: 'Show version number' },
      ],
    });

    console.log();
    console.log(pc.dim('  Examples:'));
    console.log(pc.gray('    shai find all files larger than 100mb'));
    console.log(pc.gray('    shai kill whatever is running on port 3000'));
    console.log(pc.gray('    shai --chat') + pc.dim('  (interactive mode)'));
    console.log();

    return 0;
  }
}
