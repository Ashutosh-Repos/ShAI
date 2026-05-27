import chalk from 'chalk';
import { accent } from './colors.js';

export function getShAITheme() {
  const accentColor = accent;
  return {
    prefix: {
      idle: accentColor('?'),
      done: accentColor('✔'),
    },
    style: {
      answer: (text: string) => accentColor(text),
      highlight: (text: string) => accentColor(text),
      description: (text: string) => chalk.dim(text),
    },
    icon: {
      cursor: accentColor('❯'),
    },
  };
}

export const shaiTheme = getShAITheme();
