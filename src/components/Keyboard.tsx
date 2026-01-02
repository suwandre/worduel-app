import { Button, Group, Stack } from '@mantine/core';
import type { GuessResult } from '../types';

interface KeyboardProps {
  onKeyPress: (key: string) => void;
  onEnter: () => void;
  onBackspace: () => void;
  letterStatuses: Record<string, GuessResult['status']>;
  disabled?: boolean;
}

const KEYBOARD_ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACK'],
];

export default function Keyboard({ onKeyPress, onEnter, onBackspace, letterStatuses, disabled }: KeyboardProps) {
  const getKeyColor = (key: string) => {
    const status = letterStatuses[key.toLowerCase()];
    if (status === 'correct') return '#6aaa64';
    if (status === 'present') return '#c9b458';
    if (status === 'absent') return '#787c7e';
    return '#d3d6da';
  };

  const handleKeyClick = (key: string) => {
    if (disabled) return;
    
    if (key === 'ENTER') {
      onEnter();
    } else if (key === 'BACK') {
      onBackspace();
    } else {
      onKeyPress(key);
    }
  };

  return (
    <Stack gap="xs">
      {KEYBOARD_ROWS.map((row, rowIndex) => (
        <Group key={rowIndex} gap="xs" justify="center">
          {row.map((key) => (
            <Button
              key={key}
              onClick={() => handleKeyClick(key)}
              disabled={disabled}
              style={{
                minWidth: key === 'ENTER' || key === 'BACK' ? 65 : 43,
                height: 58,
                padding: '0 6px',
                backgroundColor: getKeyColor(key),
                color: letterStatuses[key.toLowerCase()] ? '#ffffff' : '#000000',
                fontSize: key === 'ENTER' || key === 'BACK' ? 12 : 14,
                fontWeight: 700,
                border: 'none',
              }}
            >
              {key === 'BACK' ? '⌫' : key}
            </Button>
          ))}
        </Group>
      ))}
    </Stack>
  );
}
