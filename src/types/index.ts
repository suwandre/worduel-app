export interface User {
  id: string;
  email: string;
  username: string;
  gamesPlayed: number;
  gamesWon: number;
  currentStreak: number;
  maxStreak: number;
}

export interface Game {
  _id: string;
  playerId: string;
  opponentId?: string;
  targetWord: string;
  guesses: string[];
  status: 'in_progress' | 'won' | 'lost';
  maxAttempts: number;
  completedAt?: string;
  createdAt: string;
}

export interface GuessResult {
  letter: string;
  status: 'correct' | 'present' | 'absent';
}

export interface SubmitGuessResponse {
  game: Game;
  result: GuessResult[];
  isCorrect: boolean;
}

export interface UserStats {
  gamesPlayed: number;
  gamesWon: number;
  winRate: number;
  currentStreak: number;
  maxStreak: number;
  guessDistribution: Record<number, number>;
}

export interface Invite {
  _id: string;
  senderId: string | { username: string; email: string };
  receiverId: string | { username: string; email: string };
  gameId?: string;
  status: 'pending' | 'accepted' | 'declined' | 'expired';
  message?: string;
  createdAt: string;
}
