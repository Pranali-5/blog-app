import { useQuery } from '@tanstack/react-query';
import { Container, Grid, Card, Image, Text, Title, Badge, Group, Stack, Loader, Flex, Pagination } from '@mantine/core';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import React, { useState } from 'react';
import { BASE_URL } from '../api/client';
import TuiLoader from '../components/Common/TuiLoader';
// import BlogExcerpt from './BlogExcerpt';
import classes from './BlogExcerpt.module.css';

interface Blog {
  _id: string;
  title: string;
  excerpt: string;
  coverImageURL: string;
  tags: { _id: string; name: string }[];
  createdAt: string;
}


export function HomePage() {
  const [page, setPage] = useState(1);
  const pageSize = 6; // Number of blogs per page

  const { data, isLoading } = useQuery({
    queryKey: ['blogs', page],
    queryFn: async () => {
      const response = await fetch(`${BASE_URL}/api/blogs?page=${page}&limit=${pageSize}`);
      return response.json();
    },
  });

  if (isLoading) {
    return <TuiLoader />;
  }

  return (
    <Container size="lg" mt={24}>
      <Title ta='center'>All Blogs</Title>
      <Grid gutter={52} mt={32}>
        {data?.blogs.map((blog: Blog) => (
          <Grid.Col key={blog._id} span={{ base: 12, sm: 6, md: 4 }}>
            <Card
              component={Link}
              to={`/blog/${blog._id}`}
              radius="md"
              withBorder
              style={{
                textDecoration: 'none',
                color: 'inherit',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                padding: '0',
              }}
            >
              <Image
                src={blog.coverImageURL}
                alt={'cover image'}
                // fit="cover"
                // radius='md md 0px 0px'
                style={{
                  objectFit: 'fill',
                  // borderRadius: 'md md 0px 0px', 
                  // aspectRatio: 'auto',
                  display: 'block',
                  maxwidth: '338px',
                  maxHeight: '191px',
                  width: 'auto',
                  height: 'auto',
                }}

              />
              <Stack style={{ flex: 1, justifyContent: 'space-between', }} p="15px 15px 10px">
                <Group mt="md" mb="xs" style={{ display: 'flex', alignItems: 'center' }}>
                  <Title order={3} ta={'center'}>{blog.title}</Title>
                </Group>
                {/* <BlogExcerpt isLoading={isLoading} blog={blog} /> */}
                {/* <Group mt="md" gap="xs">
                    {blog.tags.map(tag => (
                      <Badge key={tag._id} variant="light">
                        {tag.name}
                      </Badge>
                    ))}
                  </Group> */}
                <Text size="sm" c="dimmed" mt="md">
                  {format(new Date(blog.createdAt), 'MMM dd, yyyy')}
                </Text>
              </Stack>
            </Card>
          </Grid.Col>
        ))}
      </Grid>
      <Pagination
        total={data?.totalPages} // Assuming your API returns total pages
        value={page}
        onChange={setPage}
        className={classes.pagination}
      />
    </Container>
  );
} 