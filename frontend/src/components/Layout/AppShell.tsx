import { AppShell as MantineAppShell, Group, Button } from '@mantine/core';
import React from 'react';
import { Link } from 'react-router-dom';

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <MantineAppShell
      header={{ height: 60 }}
      padding="md"
    >
      <MantineAppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            <h2>Blog App</h2>
          </Link>
          <Group>
            <Button component={Link} to="/admin/blog/new" variant="outline">
              Create Blog
            </Button>
          </Group>
        </Group>
      </MantineAppShell.Header>

      <MantineAppShell.Main>
        {children}
      </MantineAppShell.Main>
    </MantineAppShell>
  );
} 