import { useQuery } from '@tanstack/react-query';
import { Container, Grid, Card, Image, Text, Title, Badge, Group, Stack, Loader, Flex } from '@mantine/core';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import React from 'react';
import { BASE_URL } from '../api/client';
import TuiLoader from '../components/Common/TuiLoader';

interface Blog {
  _id: string;
  title: string;
  excerpt: string;
  coverImageURL: string;
  tags: { _id: string; name: string }[];
  createdAt: string;
}

export function HomePage() {
  const { data, isLoading } = useQuery({
    queryKey: ['blogs'],
    queryFn: async () => {
      const response = await fetch(`${BASE_URL}/api/blogs`);
      return response.json();
    },
  });

  if (isLoading) {
    return <TuiLoader />;
  }

  return (
    <Container size="lg">
      <Grid>
        {data?.blogs.map((blog: Blog) => (
          <Grid.Col key={blog._id} span={{ base: 12, sm: 6, md: 4 }}>
            <Card
              component={Link}
              to={`/blog/${blog._id}`}
              padding="lg"
              radius="md"
              withBorder
              style={{
                textDecoration: 'none',
                color: 'inherit',
                height: '300px',
                display: 'flex',
                flexDirection: 'column'
              }}
            >

              <Stack style={{ flex: 1, justifyContent: 'space-between' }}>
                <div>
                  <Group mt="md" mb="xs">
                    <Title order={3}>{blog.title}</Title>
                  </Group>

                  <Text size="sm" c="dimmed" lineClamp={3}>
                    {blog.excerpt}
                  </Text>
                </div>

                <div>
                  <Group mt="md" gap="xs">
                    {blog.tags.map(tag => (
                      <Badge key={tag._id} variant="light">
                        {tag.name}
                      </Badge>
                    ))}
                  </Group>

                  <Text size="sm" c="dimmed" mt="md">
                    {format(new Date(blog.createdAt), 'MMM dd, yyyy')}
                  </Text>
                </div>
              </Stack>
            </Card>
          </Grid.Col>
        ))}
      </Grid>
    </Container>
  );
} 