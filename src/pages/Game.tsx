import { Paper, Title, Text } from '@mantine/core';
import { useParams } from 'react-router-dom';

export default function Game() {
  const { id } = useParams();

  return (
    <Paper shadow="md" p="xl" radius="md">
      <Title order={2} mb="md">
        Game {id}
      </Title>
      <Text c="dimmed">Game UI coming next!</Text>
    </Paper>
  );
}
