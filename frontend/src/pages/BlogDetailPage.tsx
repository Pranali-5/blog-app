import { useQuery } from '@tanstack/react-query';
import { Container, Grid, Card, Text, Title, Badge, Group, Stack, Paper, Image, Button } from '@mantine/core';
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
import classes from './BlogExcerpt.module.css';
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
    content: isLoading ? '' : data.blog.content, //data.blog.content
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
      <Grid gutter={{ base: 'lg', md: 'xl' }}>
        <Grid.Col span={{ base: 12, md: 8 }}>
          <Stack>
            <Title>{data.blog.title}</Title>
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
            <Group>
              {data.blog.tags.map((tag: any) => (
                <Badge key={tag._id}>{tag.name}</Badge>
              ))}
            </Group>
            <RichTextEditor editor={editor} className={classes.editor}>
              <RichTextEditor.Content />
            </RichTextEditor>

            {/* <EditorContent editor={editor} /> */}
            <Group mt="md">
              {isFetched && roleData.role === 'ADMIN' && (
                <>
                  <Button component={Link} to={`/admin/blog/edit/${data.blog._id}`} variant="outline">
                    Edit Blog
                  </Button>
                  <Button variant="outline" color="red" onClick={handleDelete}>
                    Delete Blog
                  </Button>
                </>
              )}
            </Group>
          </Stack>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Stack>
            {/* Related Posts Section */}
            {data.relatedBlogs.length ? <Paper withBorder p="md" radius="md">
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
                    <Text lineClamp={2} size="sm" c="dimmed" mt="xs">
                      {blog.excerpt}
                    </Text>
                  </Card>
                ))}
              </Stack>
            </Paper> : null}

            {/* Recent Posts Section */}
            {data.recentBlogs ? <Paper withBorder p="md" radius="md">
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
                    <Text lineClamp={2} size="sm" c="dimmed" mt="xs">
                      {blog.excerpt}
                    </Text>
                  </Card>
                ))}
              </Stack>
            </Paper> : null}
          </Stack>
        </Grid.Col>
      </Grid>
    </Container>
  );
}