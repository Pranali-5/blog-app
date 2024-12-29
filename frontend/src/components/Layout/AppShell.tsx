import { AppShell as MantineAppShell, Group, Button } from '@mantine/core';
import { Link, useLocation } from 'react-router-dom';
import React from 'react';

export function AppShell({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem('token');
  const location = useLocation();
  const isAuthPage = location.pathname.includes('/admin/signin') || location.pathname.includes('/admin/signup');

  return (
    <MantineAppShell
      header={{ height: 60 }}
      padding="md"
      w='100%'
    >
      <MantineAppShell.Header>
        <Group h="100%" px="md" justify="space-between" align='center' wrap='nowrap'>
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            <h2>Blog App</h2>
          </Link>
          <Group>
            {token ? (
              <Button component={Link} to="/admin/blog/new" variant="outline">
                Create Blog
              </Button>
            ) : !isAuthPage && (
              <Group>
                <Button component={Link} to="/admin/signin" variant="subtle">
                  Sign In
                </Button>
                <Button component={Link} to="/admin/signup" variant="filled">
                  Sign Up
                </Button>
              </Group>
            )}
          </Group>
        </Group>
      </MantineAppShell.Header>

      <MantineAppShell.Main>
        {children}
      </MantineAppShell.Main>
    </MantineAppShell>
  );
} 