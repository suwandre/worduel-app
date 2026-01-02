import { Button, Paper, Title, Text, Group, Stack } from '@mantine/core';
import { useAuth } from '../hooks/useAuth';

export default function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <div>
      <Paper shadow="md" p="xl" radius="md" mb="xl">
        <Group justify="space-between" align="center">
          <div>
            <Title order={2}>Welcome, {user?.username}!</Title>
            <Text c="dimmed">Ready to play Worduel?</Text>
          </div>
          <Button variant="outline" color="red" onClick={logout}>
            Logout
          </Button>
        </Group>
      </Paper>

      <Paper shadow="md" p="xl" radius="md" mb="xl">
        <Title order={3} mb="md">
          Your Stats
        </Title>
        <Stack gap="sm">
          <Group justify="space-between">
            <Text>Games Played:</Text>
            <Text fw={700}>{user?.gamesPlayed || 0}</Text>
          </Group>
          <Group justify="space-between">
            <Text>Games Won:</Text>
            <Text fw={700}>{user?.gamesWon || 0}</Text>
          </Group>
          <Group justify="space-between">
            <Text>Current Streak:</Text>
            <Text fw={700}>{user?.currentStreak || 0}</Text>
          </Group>
          <Group justify="space-between">
            <Text>Max Streak:</Text>
            <Text fw={700}>{user?.maxStreak || 0}</Text>
          </Group>
        </Stack>
      </Paper>

      <Paper shadow="md" p="xl" radius="md">
        <Title order={3} mb="md">
          Quick Actions
        </Title>
        <Text c="dimmed" mb="md">
          Game features coming soon!
        </Text>
        <Button disabled>Create New Game</Button>
      </Paper>
    </div>
  );
}
