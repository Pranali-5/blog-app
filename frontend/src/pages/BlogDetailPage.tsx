import { useQuery } from '@tanstack/react-query';
import { Container, Grid, Card, Text, Title, Badge, Group, Stack, Paper, Image, Button, Breadcrumbs, Flex } from '@mantine/core';
import { useParams, Link, useNavigate } from 'react-router-dom';
import React, { useEffect } from 'react';
import { BASE_URL } from '../api/client';
import { blogService } from '../api/blogService';
import { notifications } from '@mantine/notifications';
import TuiLoader from '../components/Common/TuiLoader';
import { Link as EditorLink } from '@mantine/tiptap';

import { useEditor } from '@tiptap/react';
import { RichTextEditor } from '@mantine/tiptap';
import Highlight from '@tiptap/extension-highlight';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Superscript from '@tiptap/extension-superscript';
import SubScript from '@tiptap/extension-subscript';
import { IconCalendar, IconEdit, IconTrash } from '@tabler/icons-react';
import classes from './BlogExcerpt.module.css';
import { format } from 'date-fns';
import BlogExcerpt from './BlogExcerpt';

export function BlogDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ['blog', id],
    queryFn: async () => {
      const response = await fetch(`${BASE_URL}/api/blogs/${id}`);
      return response.json();
    },
  });

  const { data: roleData, isFetched } = useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const response = await fetch(`${BASE_URL}/api/auth/me`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      return response.json();
    }
  });

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      try {
        await blogService.deleteBlog(id as string);
        notifications.show({
          title: 'Success',
          message: 'Blog deleted successfully!',
          color: 'green',
        });
        navigate('/');
      } catch (error) {
        notifications.show({
          title: 'Error',
          message: 'Failed to delete blog',
          color: 'red',
        });
      }
    }
  };

  const editor = useEditor({
    extensions: [StarterKit,
      Underline,
      EditorLink,
      Superscript,
      SubScript,
      Highlight,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),],
    content: isLoading ? '' : data.blog.content,
    editable: false,
  });

  useEffect(() => {
    if (editor && !isLoading) {
      editor.commands.setContent(data.blog.content);
    }
  }, [isLoading]);

  if (isLoading) {
    return <TuiLoader />;
  }

  return (
    <Container size='xxl' p={{ base: 'lg', md: 'xl' }}>
      <Breadcrumbs mb={16}>
        <Link to="/"><Text style={{ color: 'var(--mantine-color-blue-outline)' }}>Home</Text></Link>
        <Text className={classes.breadcrumbTitle}>{data.blog.title}</Text>
      </Breadcrumbs>


      <Grid gutter={{ base: 'lg', md: 'xl' }}>
        <Grid.Col span={{ base: 12, md: 8 }}>
          <Stack>
            <Stack>
              <Flex align='center' justify='space-between' wrap={'wrap'}>
                <Title order={2}>{data.blog.title}</Title>
                <Group>
                  {isFetched && roleData.role === 'ADMIN' && (
                    <Flex align='center' gap={16}>
                      <Link to={`/admin/blog/edit/${data.blog._id}`}>
                        <IconEdit cursor='pointer' color='var(--mantine-color-text)' style={{ marginTop: 8 }} />
                      </Link>
                      <IconTrash onClick={handleDelete} cursor='pointer' />
                    </Flex>
                  )}
                </Group>
              </Flex>
              <Flex align='center'>
                <IconCalendar size={16} />
                <Text size="sm" ml={8}>
                  {format(new Date(data.blog.createdAt), 'MMM dd, yyyy')}
                </Text>
              </Flex>
            </Stack>
            <Group mb={16}>
              {data.blog.tags.map((tag: any) => (
                <Badge key={tag._id} color="blue">{tag.name}</Badge>
              ))}
            </Group>

            {data.blog.coverImageURL && <Image src={`${data.blog.coverImageURL}`} radius={10} alt={data.blog.title} m={'20px 0px'} style={{
              objectFit: 'fill',
              // borderRadius: 'md md 0px 0px', 
              // aspectRatio: 'auto',
              display: 'block',
              maxwidth: '100%',
              maxHeight: '450px',
              width: 'auto',
              height: 'auto',
            }} />}
            <RichTextEditor editor={editor} className={classes.editor}>
              <RichTextEditor.Content />
            </RichTextEditor>

          </Stack>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Stack>
            {data.relatedBlogs.length ? (
              <Paper withBorder p="md" radius="md">
                <Title order={3} mb="md">Related Posts</Title>
                <Stack>
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
                      <BlogExcerpt isLoading={isLoading} blog={blog} />
                    </Card>
                  ))}
                </Stack>
              </Paper>
            ) : null}

            {data.recentBlogs ? (
              <Paper withBorder p="md" radius="md">
                <Title order={3} mb="md">Recent Posts</Title>
                <Stack>
                  {data.recentBlogs.map((blog: any) => (
                    <Card
                      key={blog._id}
                      component={Link}
                      to={`/blog/${blog._id}`}
                      padding="md"
                      withBorder
                      style={{ textDecoration: 'none', color: 'inherit' }}
                    >
                      <Title order={4}>{blog.title}</Title>
                      <BlogExcerpt isLoading={isLoading} blog={blog} />
                    </Card>
                  ))}
                </Stack>
              </Paper>
            ) : null}
          </Stack>
        </Grid.Col>
      </Grid>
    </Container>
  );
}