import { useEffect, useState } from 'react';
import { Paper, Title, Text, Stack, Button, Group, Badge } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../api/client';
import type { Game } from '../types';

export default function GamesList() {
  const navigate = useNavigate();
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    try {
      const response = await apiClient.get('/games');
      setGames(response.data);
    } catch (error) {
      console.error('Failed to fetch games:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: Game['status']) => {
    const colors = {
      in_progress: 'blue',
      won: 'green',
      lost: 'red',
    };
    return (
      <Badge color={colors[status]}>
        {status.replace('_', ' ').toUpperCase()}
      </Badge>
    );
  };

  if (loading) return <Text>Loading games...</Text>;

  if (games.length === 0) {
    return (
      <Paper shadow="md" p="xl" radius="md">
        <Text c="dimmed" ta="center">
          No games yet. Create your first game!
        </Text>
      </Paper>
    );
  }

  return (
    <Paper shadow="md" p="xl" radius="md">
      <Title order={3} mb="md">
        Your Games
      </Title>
      <Stack gap="sm">
        {games.map((game) => (
          <Paper key={game._id} p="md" withBorder>
            <Group justify="space-between" align="center">
              <div>
                <Group gap="sm" mb="xs">
                  {getStatusBadge(game.status)}
                  <Text size="sm" c="dimmed">
                    {game.guesses.length}/{game.maxAttempts} attempts
                  </Text>
                </Group>
                <Text size="xs" c="dimmed">
                  Created: {new Date(game.createdAt).toLocaleDateString()}
                </Text>
              </div>
              <Button
                size="sm"
                variant={game.status === 'in_progress' ? 'filled' : 'outline'}
                onClick={() => navigate(`/game/${game._id}`)}
              >
                {game.status === 'in_progress' ? 'Continue' : 'View'}
              </Button>
            </Group>
          </Paper>
        ))}
      </Stack>
    </Paper>
  );
}
