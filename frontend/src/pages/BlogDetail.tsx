import { useQuery } from '@tanstack/react-query';
import { Container, Grid, Card, Text, Title } from '@mantine/core';
import { blogService } from '../api/blogService';
import { useParams, Link } from 'react-router-dom';
import React from 'react';
import TuiLoader from '../components/Common/TuiLoader';

export function BlogDetail() {
  const { id } = useParams();
  const { data, isLoading } = useQuery({
    queryKey: ['blog', id],
    queryFn: () => blogService.getBlogById(id as string),
  });

  if (isLoading) {
    return <TuiLoader />;
  }

  return (
    <Container size="lg" py="xl">
      <Grid>
        <Grid.Col span={8}>
          <Title>{data?.blog.title}</Title>
          <Text mt="xl">{data?.blog.content}</Text>

          <Title order={3} mt="xl">Recent Posts</Title>
          <Grid mt="md">
            {data?.recentBlogs.map((blog: any) => (
              <Grid.Col key={blog._id} span={6}>
                <Card component={Link} to={`/blog/${blog._id}`}>
                  <Title order={4}>{blog.title}</Title>
                  <Text lineClamp={2}>{blog.excerpt}</Text>
                </Card>
              </Grid.Col>
            ))}
          </Grid>
        </Grid.Col>

        <Grid.Col span={4}>
          <Title order={3}>Related Posts</Title>
          {data?.relatedBlogs.map((blog: any) => (
            <Card key={blog._id} mt="md" component={Link} to={`/blog/${blog._id}`}>
              <Title order={4}>{blog.title}</Title>
              <Text lineClamp={2}>{blog.excerpt}</Text>
            </Card>
          ))}
        </Grid.Col>
      </Grid>
    </Container>
  );
}