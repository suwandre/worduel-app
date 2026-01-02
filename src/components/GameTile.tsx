import { Box } from '@mantine/core';
import type { GuessResult } from '../types';

interface GameTileProps {
  letter: string;
  status?: GuessResult['status'];
  revealed?: boolean;
}

export default function GameTile({ letter, status, revealed = false }: GameTileProps) {
  const getBackgroundColor = () => {
    if (!revealed || !status) return '#ffffff';
    if (status === 'correct') return '#6aaa64'; // Green
    if (status === 'present') return '#c9b458'; // Yellow
    return '#787c7e'; // Gray
  };

  const getBorderColor = () => {
    if (letter && !revealed) return '#878a8c';
    return '#d3d6da';
  };

  return (
    <Box
      style={{
        width: 62,
        height: 62,
        border: `2px solid ${getBorderColor()}`,
        backgroundColor: getBackgroundColor(),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 32,
        fontWeight: 700,
        color: revealed && status ? '#ffffff' : '#000000',
        textTransform: 'uppercase',
        transition: 'all 0.3s ease',
      }}
    >
      {letter}
    </Box>
  );
}
