import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { TextInput, PasswordInput, Button, Paper, Title, Text, Stack } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useAuth } from '../hooks/useAuth';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

  const form = useForm({
    initialValues: {
      email: '',
      password: '',
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      password: (value) => (value.length >= 6 ? null : 'Password must be at least 6 characters'),
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    setLoading(true);
    try {
      await login(values.email, values.password);
      navigate('/dashboard');
    } catch (error) {
      console.error(`(handleSummit) Error logging in: ${error}`);
      // Error notification handled in AuthProvider
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper shadow="md" p="xl" radius="md" style={{ maxWidth: 400, margin: '100px auto' }}>
      <Title order={2} ta="center" mb="md">
        Welcome to Worduel
      </Title>
      <Text c="dimmed" size="sm" ta="center" mb="xl">
        Login to start playing
      </Text>

      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="md">
          <TextInput
            label="Email"
            placeholder="your@email.com"
            required
            {...form.getInputProps('email')}
          />

          <PasswordInput
            label="Password"
            placeholder="Your password"
            required
            {...form.getInputProps('password')}
          />

          <Button type="submit" fullWidth loading={loading}>
            Login
          </Button>

          <Text size="sm" ta="center">
            Don't have an account?{' '}
            <Text component={Link} to="/register" c="blue" style={{ textDecoration: 'none' }}>
              Register here
            </Text>
          </Text>
        </Stack>
      </form>
    </Paper>
  );
}
