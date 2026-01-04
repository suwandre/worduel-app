import { useState, useEffect } from "react";
import {
  Modal,
  Button,
  Stack,
  Text,
  Select,
  Group,
  SegmentedControl,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { apiClient } from "../api/client";
import { useNavigate } from "react-router-dom";

interface CreateGameModalProps {
  opened: boolean;
  onClose: () => void;
}

interface User {
  id: string;
  username: string;
  email: string;
}

export default function CreateGameModal({
  opened,
  onClose,
}: CreateGameModalProps) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [wordOptions, setWordOptions] = useState<string[]>([]);
  const [selectedWord, setSelectedWord] = useState<string>("");
  const [selectedOpponent, setSelectedOpponent] = useState<string>("");
  const [loadingWords, setLoadingWords] = useState(false);
  const [totalRounds, setTotalRounds] = useState<string>("3");

  useEffect(() => {
    if (opened) {
      fetchUsers();
      fetchWordOptions();
      setSelectedWord("");
      setSelectedOpponent("");
      setTotalRounds("3");
    }
  }, [opened]);

  const fetchUsers = async () => {
    try {
      const usersList = await apiClient.get("/users/list");
      setUsers(usersList.data);
    } catch {
      notifications.show({
        title: "Error",
        message: "Failed to load users",
        color: "red",
      });
    } finally {
      setLoadingUsers(false);
    }
  };

  const fetchWordOptions = async () => {
    setLoadingWords(true);
    try {
      const response = await apiClient.get("/games/word-options?count=4");
      setWordOptions(response.data);
      setSelectedWord("");
    } catch {
      notifications.show({
        title: "Error",
        message: "Failed to load word options",
        color: "red",
      });
    } finally {
      setLoadingWords(false);
    }
  };

  const handleSubmit = async () => {
    if (!selectedWord || !selectedOpponent) return;

    setLoading(true);
    try {
      const response = await apiClient.post("/games", {
        targetWord: selectedWord,
        opponentId: selectedOpponent,
        totalRounds: parseInt(totalRounds, 10),
      });

      const opponent = users.find((u) => u.id === selectedOpponent);
      notifications.show({
        title: "Game created!",
        message: `${totalRounds} round game vs ${opponent?.username} started!`,
        color: "green",
      });

      onClose();
      navigate(`/game/${response.data._id}`);
    } catch {
      notifications.show({
        title: "Error",
        message: "Failed to create game",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Create New Game"
      centered
      size="lg"
    >
      <Stack gap="md">
        <Text size="sm" c="dimmed">
          Choose rounds, opponent, and target word
        </Text>

        <Stack gap="xs">
          <Text size="sm" fw={500}>
            Number of Rounds
          </Text>
          <SegmentedControl
            value={totalRounds}
            onChange={setTotalRounds}
            data={[
              { label: "3 Rounds", value: "3" },
              { label: "5 Rounds", value: "5" },
              { label: "10 Rounds", value: "10" },
              { label: "25 Rounds", value: "25" },
            ]}
            fullWidth
          />
        </Stack>

        <Select
          label="Opponent"
          placeholder="Select opponent"
          data={users.map((u) => ({ value: u.id, label: u.username }))}
          value={selectedOpponent}
          onChange={(val) => setSelectedOpponent(val || "")}
          searchable
          required
          disabled={loadingUsers}
        />

        <Stack gap="xs">
          <Text size="sm" fw={500}>
            Target Word (Select 1 of 4)
          </Text>
          <Group gap="xs">
            {wordOptions.map((word) => (
              <Button
                key={word}
                variant={selectedWord === word ? "filled" : "outline"}
                onClick={() => setSelectedWord(word)}
                disabled={loadingWords}
                size="md"
              >
                {word}
              </Button>
            ))}
          </Group>
          <Button
            variant="subtle"
            size="xs"
            onClick={fetchWordOptions}
            loading={loadingWords}
          >
            🔄 Get Different Words
          </Button>
        </Stack>

        <Button
          onClick={handleSubmit}
          fullWidth
          loading={loading}
          disabled={!selectedWord || !selectedOpponent}
        >
          Create Game
        </Button>
      </Stack>
    </Modal>
  );
}
