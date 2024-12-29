import { TextInput, PasswordInput, Button, Group, Anchor } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useMutation } from '@tanstack/react-query';
import { authService } from '../../api/authService';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { AuthLayout } from '../../components/auth/AuthLayout';
import React from 'react';
import { notifications } from '@mantine/notifications';
import { AxiosError } from 'axios';

export function SignIn() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/admin/blog/new';
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
      notifications.show({
        title: 'Success',
        message: 'Successfully signed in!',
        color: 'green'
      });
      navigate(from, { replace: true });
    },
    onError: (error: AxiosError<{message: string}>) => {
      notifications.show({
        title: 'Error',
        message: error.response?.data?.message || 'Failed to sign in',
        color: 'red'
      });
    }
  });

  return (
    <AuthLayout title="Welcome back!">
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
        <Group justify="space-between" mt="md">
          <Anchor component={Link} to="/admin/signup" size="sm">
            Don't have an account? Register
          </Anchor>
        </Group>
        <Button 
          fullWidth 
          mt="xl" 
          type="submit" 
          loading={loginMutation.isPending}
        >
          Sign in
        </Button>
      </form>
    </AuthLayout>
  );
}