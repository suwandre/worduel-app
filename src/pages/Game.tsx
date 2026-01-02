import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Paper, Title, Text, Stack, Button, Group, Modal } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { apiClient } from "../api/client";
import GameGrid from "../components/GameGrid";
import Keyboard from "../components/Keyboard";
import type { Game, GuessResult, SubmitGuessResponse } from "../types";

export default function GamePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [game, setGame] = useState<Game | null>(null);
  const [currentGuess, setCurrentGuess] = useState("");
  const [guessResults, setGuessResults] = useState<GuessResult[][]>([]);
  const [letterStatuses, setLetterStatuses] = useState<
    Record<string, GuessResult["status"]>
  >({});
  const [loading, setLoading] = useState(true);
  const [modalOpened, setModalOpened] = useState(false);

  const calculateGuessResult = (
    guess: string,
    target: string
  ): GuessResult[] => {
    const result: GuessResult[] = [];
    const targetLetters = target.split("");
    const guessLetters = guess.split("");
    const targetUsed = new Array(target.length).fill(false);
    const guessStatus = new Array(guess.length).fill("absent");

    // First pass: correct positions
    for (let i = 0; i < guessLetters.length; i++) {
      if (guessLetters[i] === targetLetters[i]) {
        guessStatus[i] = "correct";
        targetUsed[i] = true;
      }
    }

    // Second pass: present letters
    for (let i = 0; i < guessLetters.length; i++) {
      if (guessStatus[i] === "correct") continue;

      for (let j = 0; j < targetLetters.length; j++) {
        if (!targetUsed[j] && guessLetters[i] === targetLetters[j]) {
          guessStatus[i] = "present";
          targetUsed[j] = true;
          break;
        }
      }
    }

    for (let i = 0; i < guessLetters.length; i++) {
      result.push({
        letter: guessLetters[i],
        status: guessStatus[i] as GuessResult["status"],
      });
    }

    return result;
  };

  const updateLetterStatuses = (results: GuessResult[]) => {
    setLetterStatuses((prev) => {
      const updated = { ...prev };
      results.forEach((result) => {
        const currentStatus = updated[result.letter];
        // Correct > Present > Absent
        if (
          result.status === "correct" ||
          (result.status === "present" && currentStatus !== "correct") ||
          !currentStatus
        ) {
          updated[result.letter] = result.status;
        }
      });
      return updated;
    });
  };

  const fetchGame = useCallback(async () => {
    try {
      const response = await apiClient.get(`/games/${id}`);
      setGame(response.data);

      // Reconstruct guess results from game data
      const results: GuessResult[][] = [];
      for (const guess of response.data.guesses) {
        const result = calculateGuessResult(guess, response.data.targetWord);
        results.push(result);
        updateLetterStatuses(result);
      }
      setGuessResults(results);

      // Show modal if game is finished
      if (response.data.status !== "in_progress") {
        setModalOpened(true);
      }
    } catch {
      notifications.show({
        title: "Error",
        message: "Failed to load game",
        color: "red",
      });
      navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    fetchGame();
  }, [fetchGame]);

  const handleKeyPress = (key: string) => {
    if (currentGuess.length < 5) {
      setCurrentGuess(currentGuess + key.toLowerCase());
    }
  };

  const handleBackspace = () => {
    setCurrentGuess(currentGuess.slice(0, -1));
  };

  const handleEnter = async () => {
    if (currentGuess.length !== 5) {
      notifications.show({
        title: "Invalid guess",
        message: "Guess must be 5 letters",
        color: "orange",
      });
      return;
    }

    try {
      const response = await apiClient.post<SubmitGuessResponse>(
        `/games/${id}/guess`,
        {
          guess: currentGuess,
        }
      );

      setGame(response.data.game);
      setGuessResults([...guessResults, response.data.result]);
      updateLetterStatuses(response.data.result);
      setCurrentGuess("");

      if (response.data.game.status !== "in_progress") {
        setModalOpened(true);
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to submit guess";
      notifications.show({
        title: "Error",
        message,
        color: "red",
      });
    }
  };

  if (loading) return <Text>Loading...</Text>;
  if (!game) return <Text>Game not found</Text>;

  const isGameOver = game.status !== "in_progress";

  return (
    <Stack align="center" gap="xl">
      <Paper
        shadow="md"
        p="xl"
        radius="md"
        style={{ width: "100%", maxWidth: 500 }}
      >
        <Title order={2} ta="center" mb="md">
          Worduel
        </Title>
        <Group justify="space-between" mb="md">
          <Text size="sm">
            Attempts: {game.guesses.length}/{game.maxAttempts}
          </Text>
          <Text
            size="sm"
            c={
              game.status === "won"
                ? "green"
                : game.status === "lost"
                ? "red"
                : undefined
            }
          >
            Status: {game.status.replace("_", " ").toUpperCase()}
          </Text>
        </Group>

        <GameGrid
          guesses={game.guesses}
          currentGuess={currentGuess}
          maxAttempts={game.maxAttempts}
          guessResults={guessResults}
        />
      </Paper>

      <Keyboard
        onKeyPress={handleKeyPress}
        onEnter={handleEnter}
        onBackspace={handleBackspace}
        letterStatuses={letterStatuses}
        disabled={isGameOver}
      />

      <Modal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        title={game.status === "won" ? "🎉 You Won!" : "😔 Game Over"}
        centered
      >
        <Stack>
          <Text>
            {game.status === "won"
              ? `Congratulations! You guessed the word in ${game.guesses.length} attempts.`
              : `The word was: ${game.targetWord.toUpperCase()}`}
          </Text>
          <Button onClick={() => navigate("/dashboard")}>
            Back to Dashboard
          </Button>
        </Stack>
      </Modal>
    </Stack>
  );
}
