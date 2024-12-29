import { TextInput, PasswordInput, Button, Container, Title, Paper } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useMutation } from '@tanstack/react-query';
import { authService } from '../../api/authService';
import { useNavigate } from 'react-router-dom';
import React from 'react';

export function SignIn() {
  const navigate = useNavigate();
  const form = useForm({
    initialValues: {
      email: '',
      password: '',
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      password: (value) => (value.length < 3 ? 'Password must be at least 3 characters' : null),
    },
  });

  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      localStorage.setItem('token', data.token);
      navigate('/admin/blog/new');
    },
  });

  return (
    <Container size={420} my={40}>
      <Title ta="center">Welcome Back</Title>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form onSubmit={form.onSubmit((values) => loginMutation.mutate(values))}>
          <TextInput
            label="Email"
            placeholder="you@example.com"
            required
            {...form.getInputProps('email')}
          />
          <PasswordInput
            label="Password"
            placeholder="Your password"
            required
            mt="md"
            {...form.getInputProps('password')}
          />
          <Button fullWidth mt="xl" type="submit" loading={loginMutation.isPending}>
            Sign in
          </Button>
        </form>
      </Paper>
    </Container>
  );
} 