import { useState } from 'react';
import { Modal, TextInput, Button, Stack, Text } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { apiClient } from '../api/client';
import { useNavigate } from 'react-router-dom';

interface CreateGameModalProps {
  opened: boolean;
  onClose: () => void;
}

export default function CreateGameModal({ opened, onClose }: CreateGameModalProps) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const form = useForm({
    initialValues: {
      targetWord: '',
    },
    validate: {
      targetWord: (value) => {
        if (value.length !== 5) return 'Word must be exactly 5 letters';
        if (!/^[a-zA-Z]+$/.test(value)) return 'Word must contain only letters';
        return null;
      },
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    setLoading(true);
    try {
      const response = await apiClient.post('/games', {
        targetWord: values.targetWord.toUpperCase(),
      });
      
      notifications.show({
        title: 'Game created!',
        message: 'Starting your new game...',
        color: 'green',
      });
      
      onClose();
      navigate(`/game/${response.data._id}`);
    } catch {
      notifications.show({
        title: 'Error',
        message: 'Failed to create game',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal opened={opened} onClose={onClose} title="Create New Game" centered>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="md">
          <Text size="sm" c="dimmed">
            Choose a 5-letter word for others to guess
          </Text>
          
          <TextInput
            label="Target Word"
            placeholder="HELLO"
            maxLength={5}
            required
            {...form.getInputProps('targetWord')}
            styles={{ input: { textTransform: 'uppercase' } }}
          />

          <Button type="submit" fullWidth loading={loading}>
            Create Game
          </Button>
        </Stack>
      </form>
    </Modal>
  );
}
