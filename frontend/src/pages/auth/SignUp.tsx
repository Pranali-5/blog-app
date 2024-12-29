import { TextInput, PasswordInput, Button, Container, Title, Paper } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useMutation } from '@tanstack/react-query';
import { authService } from '../../api/authService';
import { useNavigate } from 'react-router-dom';
import React from 'react';

export function SignUp() {
  const navigate = useNavigate();
  const form = useForm({
    initialValues: {
      name: '',
      email: '',
      password: '',
    },
    validate: {
      name: (value) => (value.length < 2 ? 'Name must be at least 2 characters' : null),
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      password: (value) => (value.length < 3 ? 'Password must be at least 3 characters' : null),
    },
  });

  const signupMutation = useMutation({
    mutationFn: authService.signup,
    onSuccess: (data) => {
      localStorage.setItem('token', data.token);
      navigate('/admin/blog/new');
    },
  });

  return (
    <Container size={420} my={40}>
      <Title ta="center">Create Account</Title>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form onSubmit={form.onSubmit((values) => signupMutation.mutate(values))}>
          <TextInput
            label="Name"
            placeholder="Your name"
            required
            {...form.getInputProps('name')}
          />
          <TextInput
            label="Email"
            placeholder="you@example.com"
            required
            mt="md"
            {...form.getInputProps('email')}
          />
          <PasswordInput
            label="Password"
            placeholder="Your password"
            required
            mt="md"
            {...form.getInputProps('password')}
          />
          <Button fullWidth mt="xl" type="submit" loading={signupMutation.isPending}>
            Sign up
          </Button>
        </form>
      </Paper>
    </Container>
  );
} 