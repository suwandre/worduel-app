export interface Game {
  _id: string;
  playerId: string;
  opponentId: string;
  targetWord: string;
  guesses: string[];
  status: 'waiting' | 'in_progress' | 'completed' | 'abandoned';
  totalRounds: number;
  currentRound: number;
  currentGuesser: string;
  currentWordSetter: string;
  points: Record<string, number>;
  roundHistory: RoundHistory[];
  winner?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RoundHistory {
  round: number;
  wordSetter: string;
  guesser: string;
  targetWord: string;
  guesses: string[];
  pointsAwarded: number;
  completedAt: string;
}

export interface GuessResult {
  letter: string;
  status: 'correct' | 'present' | 'absent';
}

export interface SubmitGuessResponse {
  game: Game;
  result: GuessResult[];
  isCorrect: boolean;
  roundComplete?: boolean;
}
