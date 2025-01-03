import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Group, Text, Button, Loader } from '@mantine/core';
import { API_URL } from '../../api/client';
import { useQuery } from '@tanstack/react-query';

export function ProtectedRoute({ children, requiredRole }: { children: React.ReactNode, requiredRole: string }) {
  const token = localStorage.getItem('token');
  const location = useLocation();

  const { data: roleData, isFetched } = useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      return response.json();
    }
  });

  return (
    <>
      {!token && (
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
      )}
      {requiredRole && isFetched && roleData.role !== requiredRole && <Navigate to="/" />}
      <Group w='100%'>
        {children}
      </Group>
    </>
  );
} 