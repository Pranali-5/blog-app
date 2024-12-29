import { useQuery } from '@tanstack/react-query';
import { Container, Grid, Pagination, Card, Text, Title, Image } from '@mantine/core';
import { blogService } from '../api/blogService';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import React from 'react';

export function Home() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useQuery({
    queryKey: ['blogs', page],
    queryFn: () => blogService.getBlogs(page),
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Container size="lg" py="xl">
      <Grid>
        {data?.blogs.map((blog: any) => (
          <Grid.Col key={blog._id} span={{ base: 12, sm: 6, md: 4 }}>
            <Card component={Link} to={`/blog/${blog._id}`} padding="lg">
              {blog.coverImageURL && (
                <Card.Section>
                  <Image src={blog.coverImageURL} height={160} alt={blog.title} />
                </Card.Section>
              )}
              <Title order={3} mt="md">{blog.title}</Title>
              <Text lineClamp={3} mt="sm" c="dimmed">{blog.excerpt}</Text>
            </Card>
          </Grid.Col>
        ))}
      </Grid>
      
      <Pagination
        total={data?.totalPages || 1}
        value={page}
        onChange={setPage}
        mt="xl"
        // position="center"
      />
    </Container>
  );
}