import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Group, Text, Button } from '@mantine/core';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem('token');
  const location = useLocation();
  
  if (!token) {
    return (
      <Group p="xl" justify="center" w='100%'>
        <Text>Please sign in to access this page</Text>
        <Button component={Navigate} to="/admin/signin" state={{ from: location }} replace>
          Sign In
        </Button>
        <Text>or</Text>
        <Button variant="outline" component={Navigate} to="/admin/signup" state={{ from: location }} replace>
          Sign Up
        </Button>
      </Group>
    );
  }
  
  return <Group w='100%'>
    {children}
  </Group>;
} 