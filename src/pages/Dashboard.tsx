import { useState } from "react";
import { Button, Paper, Title, Text, Group, Stack, Grid } from "@mantine/core";
import { useAuth } from "../hooks/useAuth";
import CreateGameModal from "../components/CreateGameModal";
import GamesList from "../components/GamesList";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [createModalOpened, setCreateModalOpened] = useState(false);

  const winRate =
    user && user.gamesPlayed > 0
      ? Math.round((user.gamesWon / user.gamesPlayed) * 100)
      : 0;

  return (
    <div>
      {/* Header */}
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

      {/* Stats Grid */}
      <Grid mb="xl">
        <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
          <Paper shadow="md" p="lg" radius="md" ta="center">
            <Text size="xl" fw={700} c="blue">
              {user?.gamesPlayed || 0}
            </Text>
            <Text size="sm" c="dimmed">
              Games Played
            </Text>
          </Paper>
        </Grid.Col>

        <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
          <Paper shadow="md" p="lg" radius="md" ta="center">
            <Text size="xl" fw={700} c="green">
              {user?.gamesWon || 0}
            </Text>
            <Text size="sm" c="dimmed">
              Games Won
            </Text>
          </Paper>
        </Grid.Col>

        <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
          <Paper shadow="md" p="lg" radius="md" ta="center">
            <Text size="xl" fw={700} c="orange">
              {winRate}%
            </Text>
            <Text size="sm" c="dimmed">
              Win Rate
            </Text>
          </Paper>
        </Grid.Col>

        <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
          <Paper shadow="md" p="lg" radius="md" ta="center">
            <Text size="xl" fw={700} c="grape">
              {user?.maxStreak || 0}
            </Text>
            <Text size="sm" c="dimmed">
              Max Streak
            </Text>
          </Paper>
        </Grid.Col>
      </Grid>

      {/* Quick Actions */}
      <Paper shadow="md" p="xl" radius="md" mb="xl">
        <Title order={3} mb="md">
          Quick Actions
        </Title>
        <Stack gap="sm">
          <Button
            fullWidth
            size="lg"
            onClick={() => setCreateModalOpened(true)}
          >
            🎮 Create New Game
          </Button>
          <Button fullWidth size="lg" variant="light" disabled>
            📨 Send Invite (Coming Soon)
          </Button>
        </Stack>
      </Paper>

      {/* Games List */}
      <GamesList />

      {/* Create Game Modal */}
      <CreateGameModal
        opened={createModalOpened}
        onClose={() => setCreateModalOpened(false)}
      />
    </div>
  );
}
