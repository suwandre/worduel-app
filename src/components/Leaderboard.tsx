import { useEffect, useState } from 'react';
import { Paper, Title, Text, Table } from '@mantine/core';
import { apiClient } from '../api/client';

interface LeaderboardEntry {
  rank: number;
  username: string;
  gamesPlayed: number;
  gamesWon: number;
  winRate: number;
  maxStreak: number;
}

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const response = await apiClient.get('/users/leaderboard');
      setLeaderboard(response.data);
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Text>Loading leaderboard...</Text>;

  return (
    <Paper shadow="md" p="xl" radius="md">
      <Title order={3} mb="md">
        🏆 Leaderboard
      </Title>

      {leaderboard.length === 0 ? (
        <Text c="dimmed" ta="center">
          No players yet
        </Text>
      ) : (
        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Rank</Table.Th>
              <Table.Th>Player</Table.Th>
              <Table.Th>Played</Table.Th>
              <Table.Th>Won</Table.Th>
              <Table.Th>Win Rate</Table.Th>
              <Table.Th>Max Streak</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {leaderboard.map((entry) => (
              <Table.Tr key={entry.rank}>
                <Table.Td>
                  <Text fw={700}>#{entry.rank}</Text>
                </Table.Td>
                <Table.Td>
                  <Text fw={500}>{entry.username}</Text>
                </Table.Td>
                <Table.Td>{entry.gamesPlayed}</Table.Td>
                <Table.Td>{entry.gamesWon}</Table.Td>
                <Table.Td>
                  <Text c={entry.winRate >= 50 ? 'green' : undefined}>
                    {entry.winRate}%
                  </Text>
                </Table.Td>
                <Table.Td>
                  <Text c="grape" fw={500}>
                    {entry.maxStreak}
                  </Text>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      )}
    </Paper>
  );
}
