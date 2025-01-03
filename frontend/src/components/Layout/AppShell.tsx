import { AppShell as MantineAppShell, Group, Button, Burger, Flex } from '@mantine/core';
import { Link, useLocation } from 'react-router-dom';
import React from 'react';
import { useDisclosure } from '@mantine/hooks';

export function AppShell({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem('token');
  const location = useLocation();
  const isAuthPage = location.pathname.includes('/admin/signin') || location.pathname.includes('/admin/signup');
  const [opened, { toggle }] = useDisclosure();

  return (
    <MantineAppShell
      header={{ height: 60 }}
      padding="md"
      w='100%'
      navbar={{ width: 300, breakpoint: 'sm', collapsed: { desktop: true, mobile: !opened } }}
    >
       <MantineAppShell.Header>
        <Group h="100%" px="md" justify="space-between" align='center' wrap='nowrap'>
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <Group justify="space-between" style={{ flex: 1 }}>
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            <h2>Blog App</h2>
          </Link>
            <Group ml="xl" gap={0} visibleFrom="sm">
             {token ? (
              <Group>
                <Button component={Link} to="/admin/blog/new" variant="outline">
                  Create Blog
                </Button>
                <Button 
                  component={Link} 
                  to="/admin/blogs/unpublished" 
                  variant="subtle"
                >
                  Unpublished Blogs
                </Button>
              </Group>
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
        </Group>
      </MantineAppShell.Header>
      <MantineAppShell.Navbar>
        <Group h="100%" px="md" justify="space-between" align='flex-start' wrap='nowrap'>
          <Group>
            {token ? (
              <Flex direction='column' align='flex-start' h='100%' mt={16} gap={16}>
                <Button component={Link} to="/" variant="subtle" onClick={toggle}>
                  Home
                </Button>
                <Button component={Link} to="/admin/blog/new" variant="subtle" onClick={toggle}>
                  Create Blog
                </Button>
                <Button 
                  component={Link} 
                  to="/admin/blogs/unpublished" 
                  variant="subtle"
                  onClick={toggle}
                >
                  Unpublished Blogs
                </Button>
              </Flex>
            ) : !isAuthPage && (
              <Flex direction='column' align='flex-start' h='100%' mt={16} gap={16}>
                <Button component={Link} to="/" variant="subtle" onClick={toggle}>
                  Home
                </Button>
                <Button component={Link} to="/admin/signin" variant="subtle" onClick={toggle}>
                  Sign In
                </Button>
                <Button component={Link} to="/admin/signup" variant="filled" onClick={toggle} ml={16}>
                  Sign Up
                </Button>
              </Flex>
            )}
          </Group>
        </Group>
      </MantineAppShell.Navbar>

      <MantineAppShell.Main>
        {children}
      </MantineAppShell.Main>
    </MantineAppShell>
  );
} 