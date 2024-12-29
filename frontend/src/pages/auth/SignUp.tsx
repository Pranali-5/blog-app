import { TextInput, PasswordInput, Button, Group, Anchor } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useMutation } from '@tanstack/react-query';
import { authService } from '../../api/authService';
import { useNavigate, Link } from 'react-router-dom';
import { AuthLayout } from '../../components/auth/AuthLayout';
import React from 'react';
import { notifications } from '@mantine/notifications';
import { AxiosError } from 'axios';

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
      notifications.show({
        title: 'Success',
        message: 'Account created successfully!',
        color: 'green'
      });
      navigate('/admin/blog/new');
    },
    onError: (error: AxiosError<{message: string}>) => {
      notifications.show({
        title: 'Error',
        message: error.response?.data?.message || 'Failed to create account',
        color: 'red'
      });
    }
  });

  return (
    <AuthLayout title="Create your account">
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
        <Group justify="space-between" mt="md">
          <Anchor component={Link} to="/admin/signin" size="sm">
            Already have an account? Login
          </Anchor>
        </Group>
        <Button 
          fullWidth 
          mt="xl" 
          type="submit" 
          loading={signupMutation.isPending}
        >
          Create account
        </Button>
      </form>
    </AuthLayout>
  );
}