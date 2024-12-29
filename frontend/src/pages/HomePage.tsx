import { useQuery } from '@tanstack/react-query';
import { Container, Grid, Card, Image, Text, Title, Badge, Group } from '@mantine/core';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import React from 'react';

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
      const response = await fetch('http://localhost:8080/api/blogs');
      return response.json();
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
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
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              {blog.coverImageURL && (
                <Card.Section>
                  <Image
                    src={blog.coverImageURL}
                    height={200}
                    alt={blog.title}
                  />
                </Card.Section>
              )}

              <Group mt="md" mb="xs">
                <Title order={3}>{blog.title}</Title>
              </Group>

              <Text size="sm" c="dimmed" lineClamp={3}>
                {blog.excerpt}
              </Text>

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
            </Card>
          </Grid.Col>
        ))}
      </Grid>
    </Container>
  );
} 