import { Container, Paper, Title } from '@mantine/core';
import React from 'react';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
}

export function AuthLayout({ children, title }: AuthLayoutProps) {
  return (
    <Container size={420} my={40}>
      <Title ta="center" mb={30}>
        {title}
      </Title>
      <Paper withBorder shadow="md" p={30} radius="md">
        {children}
      </Paper>
    </Container>
  );
} 