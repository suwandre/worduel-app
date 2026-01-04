import { useState, useEffect } from "react";
import { Modal, Button, Stack, Text, Group } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { apiClient } from "../api/client";

interface WordSelectionModalProps {
  opened: boolean;
  gameId: string;
  onWordSelected: () => void;
}

export default function WordSelectionModal({
  opened,
  gameId,
  onWordSelected,
}: WordSelectionModalProps) {
  const [wordOptions, setWordOptions] = useState<string[]>([]);
  const [selectedWord, setSelectedWord] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [loadingWords, setLoadingWords] = useState(false);

  useEffect(() => {
    if (opened) {
      fetchWordOptions();
    }
  }, [opened]);

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
    if (!selectedWord) return;

    setLoading(true);
    try {
      await apiClient.post(`/games/${gameId}/set-word`, {
        word: selectedWord,
      });

      notifications.show({
        title: "Word Set!",
        message: "Your opponent can now start guessing",
        color: "green",
      });

      onWordSelected();
    } catch {
      notifications.show({
        title: "Error",
        message: "Failed to set word",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={() => {}}
      title="Choose Target Word"
      centered
      closeOnClickOutside={false}
      closeOnEscape={false}
      withCloseButton={false}
    >
      <Stack gap="md">
        <Text size="sm" c="dimmed">
          Select a word for your opponent to guess
        </Text>

        <Stack gap="xs">
          <Text size="sm" fw={500}>
            Select 1 of 4 Words
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
          disabled={!selectedWord}
        >
          Confirm Word
        </Button>
      </Stack>
    </Modal>
  );
}
