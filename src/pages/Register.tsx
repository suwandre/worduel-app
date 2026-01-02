import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { TextInput, PasswordInput, Button, Paper, Title, Text, Stack } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useAuth } from '../hooks/useAuth';

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [loading, setLoading] = useState(false);

  const form = useForm({
    initialValues: {
      email: '',
      username: '',
      password: '',
      confirmPassword: '',
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      username: (value) => (value.length >= 3 ? null : 'Username must be at least 3 characters'),
      password: (value) => (value.length >= 6 ? null : 'Password must be at least 6 characters'),
      confirmPassword: (value, values) =>
        value === values.password ? null : 'Passwords do not match',
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    setLoading(true);
    try {
      await register(values.email, values.username, values.password);
      navigate('/dashboard');
    } catch (error) {
      console.error(`(handleSummit) Error registering: ${error}`);
      // Error notification handled in AuthProvider
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper shadow="md" p="xl" radius="md" style={{ maxWidth: 400, margin: '100px auto' }}>
      <Title order={2} ta="center" mb="md">
        Create Account
      </Title>
      <Text c="dimmed" size="sm" ta="center" mb="xl">
        Join Worduel and challenge your friends
      </Text>

      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="md">
          <TextInput
            label="Email"
            placeholder="your@email.com"
            required
            {...form.getInputProps('email')}
          />

          <TextInput
            label="Username"
            placeholder="Your username"
            required
            {...form.getInputProps('username')}
          />

          <PasswordInput
            label="Password"
            placeholder="Your password"
            required
            {...form.getInputProps('password')}
          />

          <PasswordInput
            label="Confirm Password"
            placeholder="Confirm your password"
            required
            {...form.getInputProps('confirmPassword')}
          />

          <Button type="submit" fullWidth loading={loading}>
            Register
          </Button>

          <Text size="sm" ta="center">
            Already have an account?{' '}
            <Text component={Link} to="/login" c="blue" style={{ textDecoration: 'none' }}>
              Login here
            </Text>
          </Text>
        </Stack>
      </form>
    </Paper>
  );
}
