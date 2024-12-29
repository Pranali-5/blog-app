import { useQuery } from '@tanstack/react-query';
import { Container, Grid, Card, Text, Title, Badge, Group, Stack } from '@mantine/core';
import { useParams, Link } from 'react-router-dom';
import { format } from 'date-fns';
import React from 'react';

export function BlogDetailPage() {
  const { id } = useParams();

  const { data, isLoading } = useQuery({
    queryKey: ['blog', id],
    queryFn: async () => {
      const response = await fetch(`http://localhost:8080/api/blogs/${id}`);
      return response.json();
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Container size="lg">
      <Grid>
        {/* Main Blog Content */}
        <Grid.Col span={{ base: 12, md: 8 }}>
          <Stack>
            <Title>{data.blog.title}</Title>
            
            <Group>
              {data.blog.tags.map((tag: any) => (
                <Badge key={tag._id}>{tag.name}</Badge>
              ))}
            </Group>

            <Text>{data.blog.content}</Text>

            {/* Recent Posts */}
            <Title order={3} mt="xl">Recent Posts</Title>
            <Grid>
              {data.recentBlogs.map((blog: any) => (
                <Grid.Col key={blog._id} span={6}>
                  <Card 
                    component={Link}
                    to={`/blog/${blog._id}`}
                    padding="md"
                    withBorder
                    style={{ textDecoration: 'none', color: 'inherit' }}
                  >
                    <Title order={4}>{blog.title}</Title>
                    <Text lineClamp={2} size="sm" c="dimmed" mt="xs">
                      {blog.excerpt}
                    </Text>
                  </Card>
                </Grid.Col>
              ))}
            </Grid>
          </Stack>
        </Grid.Col>

        {/* Related Posts Sidebar */}
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Title order={3}>Related Posts</Title>
          <Stack mt="md">
            {data.relatedBlogs.map((blog: any) => (
              <Card
                key={blog._id}
                component={Link}
                to={`/blog/${blog._id}`}
                padding="md"
                withBorder
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <Title order={4}>{blog.title}</Title>
                <Text lineClamp={2} size="sm" c="dimmed" mt="xs">
                  {blog.excerpt}
                </Text>
              </Card>
            ))}
          </Stack>
        </Grid.Col>
      </Grid>
    </Container>
  );
}