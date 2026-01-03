import { useState, useEffect } from 'react';
import { Modal, TextInput, Button, Stack, Text, Select } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { apiClient } from '../api/client';
import { useNavigate } from 'react-router-dom';

interface CreateGameModalProps {
  opened: boolean;
  onClose: () => void;
}

interface User {
  id: string;
  username: string;
  email: string;
}

export default function CreateGameModal({ opened, onClose }: CreateGameModalProps) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  useEffect(() => {
    if (opened) {
      fetchUsers();
    }
  }, [opened]);

  const fetchUsers = async () => {
    try {
      const response = await apiClient.get('/users/leaderboard');
      setUsers(response.data.map((u: User) => ({
        id: u.username, // Use username as ID for now
        username: u.username,
      })));
    } catch {
      notifications.show({
        title: 'Error',
        message: 'Failed to load users',
        color: 'red',
      });
    } finally {
      setLoadingUsers(false);
    }
  };

  const form = useForm({
    initialValues: {
      targetWord: '',
      opponentUsername: '',
    },
    validate: {
      targetWord: (value) => {
        if (value.length !== 5) return 'Word must be exactly 5 letters';
        if (!/^[a-zA-Z]+$/.test(value)) return 'Word must contain only letters';
        return null;
      },
      opponentUsername: (value) => {
        if (!value) return 'Please select an opponent';
        return null;
      },
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    setLoading(true);
    try {
      // Find opponent by username
      const opponent = users.find(u => u.username === values.opponentUsername);
      
      const response = await apiClient.post('/games', {
        targetWord: values.targetWord.toUpperCase(),
        opponentId: opponent?.id, // This won't work yet - we need user ID endpoint
      });
      
      notifications.show({
        title: 'Game created!',
        message: `Waiting for ${values.opponentUsername} to play...`,
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
            Choose a word and challenge an opponent
          </Text>

          <Select
            label="Opponent"
            placeholder="Select opponent"
            data={users.map(u => ({ value: u.username, label: u.username }))}
            searchable
            required
            disabled={loadingUsers}
            {...form.getInputProps('opponentUsername')}
          />
          
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
