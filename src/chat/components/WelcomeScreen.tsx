import { Box, Text } from 'ink';
import type { ReactNode } from 'react';
import { memo } from 'react';
import { useTheme } from '../utils/ThemeContext.js';
import { CatIcon } from './CatIcon.js';

const SHAI_ASCII = `
███████╗██╗  ██╗ █████╗ ██╗
██╔════╝██║  ██║██╔══██╗██║
███████╗███████║███████║██║
╚════██║██╔══██║██╔══██║██║
███████║██║  ██║██║  ██║██║
╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝
`.trim();

interface WelcomeScreenProps {
  width: number;
  height: number;
  children?: ReactNode;
}

export const WelcomeScreen = memo(function WelcomeScreen({
  width,
  height,
  children,
}: WelcomeScreenProps) {
  const lines = SHAI_ASCII.split('\n');
  const theme = useTheme();

  return (
    <Box
      flexDirection="column"
      width={width}
      height={height}
      justifyContent="center"
      alignItems="center"
      backgroundColor={theme.background}
    >
      <Box
        flexDirection="column"
        alignItems="center"
        backgroundColor={theme.background}
      >
        {/* Cat Icon */}
        <CatIcon />
        {/* Gap between cat and text */}
        <Box paddingTop={1} backgroundColor={theme.background} />
        {/* SHAI text */}
        {lines.map((line, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: Static ASCII art lines
          <Text key={`ascii-${i}`} color={theme.textPrimary} bold>
            {line}
          </Text>
        ))}
        {/* Input box below ASCII art - use padding for proper background fill */}
        {children && (
          <Box paddingTop={2} backgroundColor={theme.background}>
            {children}
          </Box>
        )}
      </Box>
    </Box>
  );
});
