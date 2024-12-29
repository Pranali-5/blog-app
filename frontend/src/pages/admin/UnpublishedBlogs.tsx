import { useQuery } from '@tanstack/react-query';
import { Container, Title, Card, Group, Button, Stack, Text, Badge } from '@mantine/core';
import { blogService } from '../../api/blogService';
import { Link } from 'react-router-dom';
import React from 'react';

export function UnpublishedBlogs() {
  const { data: blogs, isLoading } = useQuery({
    queryKey: ['unpublishedBlogs'],
    queryFn: blogService.getUnpublishedBlogs,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Container size="lg" py="xl">
      <Title mb="xl">Unpublished Blogs</Title>
      <Stack>
        {blogs?.map((blog: any) => (
          <Card key={blog._id} withBorder padding="lg">
            <Group justify="space-between" align="flex-start">
              <div>
                <Title order={3}>{blog.title}</Title>
                <Text c="dimmed" size="sm" mt="xs" lineClamp={2}>
                  {blog.excerpt}
                </Text>
                <Group mt="md">
                  {blog.tags.map((tag: any) => (
                    <Badge key={tag._id}>{tag.name}</Badge>
                  ))}
                </Group>
              </div>
              <Button
                component={Link}
                to={`/admin/blog/edit/${blog._id}`}
                variant="outline"
              >
                Edit & Publish
              </Button>
            </Group>
          </Card>
        ))}
        {blogs?.length === 0 && (
          <Text ta="center" c="dimmed">
            No unpublished blogs found
          </Text>
        )}
      </Stack>
    </Container>
  );
} 