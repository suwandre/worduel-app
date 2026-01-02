import { Stack, Group } from '@mantine/core';
import GameTile from './GameTile';
import type { GuessResult } from '../types';

interface GameGridProps {
  guesses: string[];
  currentGuess: string;
  maxAttempts: number;
  guessResults: GuessResult[][];
}

export default function GameGrid({ guesses, currentGuess, maxAttempts, guessResults }: GameGridProps) {
  const rows = Array.from({ length: maxAttempts }, (_, i) => {
    // Past guess
    if (i < guesses.length) {
      const guess = guesses[i];
      const results = guessResults[i] || [];
      return (
        <Group gap="xs" key={i} justify="center">
          {Array.from({ length: 5 }, (_, j) => (
            <GameTile
              key={j}
              letter={guess[j] || ''}
              status={results[j]?.status}
              revealed={true}
            />
          ))}
        </Group>
      );
    }

    // Current guess being typed
    if (i === guesses.length) {
      return (
        <Group gap="xs" key={i} justify="center">
          {Array.from({ length: 5 }, (_, j) => (
            <GameTile key={j} letter={currentGuess[j] || ''} />
          ))}
        </Group>
      );
    }

    // Empty future rows
    return (
      <Group gap="xs" key={i} justify="center">
        {Array.from({ length: 5 }, (_, j) => (
          <GameTile key={j} letter="" />
        ))}
      </Group>
    );
  });

  return <Stack gap="xs">{rows}</Stack>;
}
