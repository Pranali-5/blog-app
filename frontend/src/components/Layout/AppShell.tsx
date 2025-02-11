import { AppShell as MantineAppShell, Group, Button, Burger, Flex } from '@mantine/core';
import { Link } from 'react-router-dom';
import React, { useEffect } from 'react';
import { useDisclosure } from '@mantine/hooks';
import { BASE_URL } from '../../api/client';
import { useQuery, useQueryClient } from '@tanstack/react-query';

export function AppShell({ children }: { children: React.ReactNode }) {
  const [opened, { toggle }] = useDisclosure();
  const queryClient = useQueryClient();
  const isToken = localStorage.getItem('token') ? true : false

  const { data: roleData, isFetched } = useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const response = await fetch(`${BASE_URL}/api/auth/me`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      return response.json();
    },
    enabled: isToken
  });

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ['currentUser'] });
  }, [location.pathname])

  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove the token from local storage
    window.location.href = '/admin/signin'; // Redirect to the sign-in page
  };
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
              {isFetched && roleData.role === 'ADMIN' && (
                <Group>
                  <Button component={Link} to="/admin/blog/new" variant="outline">
                    Create Blog
                  </Button>
                  <Button component={Link} to="/admin/blogs/unpublished" variant="subtle">
                    Unpublished Blogs
                  </Button>
                </Group>
              )}
              {
                isToken && <Button variant="outline" onClick={handleLogout} ml={16}>
                  Logout
                </Button>
              }
              {!roleData?.role && !isToken && (
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
            {isFetched && roleData.role === 'ADMIN' && (
              <Flex direction='column' align='flex-start' h='100%' mt={16} gap={16}>
                <Button component={Link} to="/" variant="subtle" onClick={toggle}>
                  Home
                </Button>
                <Button component={Link} to="/admin/blog/new" variant="subtle" onClick={toggle}>
                  Create Blog
                </Button>
                <Button component={Link} to="/admin/blogs/unpublished" variant="subtle" onClick={toggle}>
                  Unpublished Blogs
                </Button>
                <Button variant="outline" onClick={handleLogout} mt={16} ml={16}>
                  Logout
                </Button>
              </Flex>
            )}
            {
              isFetched && roleData.role === 'USER' && <Flex direction='column' align='flex-start' h='100%' mt={16} gap={16}>
                <Button component={Link} to="/" variant="subtle" onClick={toggle}>
                  Home
                </Button><Button variant="outline" onClick={handleLogout} mt={16} ml={16}>
                  Logout
                </Button>
              </Flex>
            }
            {!roleData?.role && !isToken && (
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