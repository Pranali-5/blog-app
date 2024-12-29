import { useForm } from '@mantine/form';
import { Container, TextInput, Textarea, Button, MultiSelect, Stack, Switch, Loader } from '@mantine/core';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { RichTextEditor, Link } from '@mantine/tiptap';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import React from 'react';
import { blogService } from '../../api/blogService';
import { notifications } from '@mantine/notifications';
import { AxiosError } from 'axios';

export function AdminBlogEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const form = useForm({
    initialValues: {
      title: '',
      content: '',
      excerpt: '',
      coverImageURL: '',
      tags: [] as string[],
      isPublished: false,
    },
  });

  const editor = useEditor({
    extensions: [StarterKit, Link],
    content: form.values.content,
    onUpdate: ({ editor }) => {
      form.setFieldValue('content', editor.getHTML());
    },
  });

  // Fetch tags for the multiselect
  const { data: tagsData, isLoading: isTagsLoading, isFetched: isTagsFetched, isError: isTagsError } = useQuery({
    queryKey: ['tags'],
    queryFn: async () => {
      const response = await fetch('http://localhost:8080/api/blogs/tags');
      return response.json();
    },
  });

  const createBlogMutation = useMutation({
    mutationFn: async (values: typeof form.values) => {
      console.log('Token:', localStorage.getItem('token')); // Debug token
      return blogService.createBlog(values);
    },
    onSuccess: () => {
       notifications.show({
              title: 'Success',
              message: 'Blog created successfully!',
              color: 'green'
            });
      navigate('/');
    },
    onError: (error: AxiosError<{message: string}> ) => {
      console.error('Blog creation error:', error);
      notifications.show({
              title: 'Error',
              message: error.response?.data?.message || 'Failed to create account',
              color: 'red'
            });
    }
  });
console.log('Tags:', tagsData);
  return (
    <Container size="xl" w='100%'>
      <form onSubmit={form.onSubmit((values) => createBlogMutation.mutate(values))}>
        <Stack gap="md" w='100%'>
          <TextInput
            label="Title"
            placeholder="Enter blog title"
            required
            {...form.getInputProps('title')}
          />

          <TextInput
            label="Cover Image URL"
            placeholder="https://example.com/image.jpg"
            {...form.getInputProps('coverImageURL')}
          />

          <Textarea
            label="Content"
            placeholder="Brief description of the blog"
            required
            {...form.getInputProps('content')}
          />

          {isTagsFetched && <MultiSelect
            label="Tags"
            placeholder="Select tags"
            data={tagsData?.map((tag: any) => ({
              value: tag._id,
              label: tag.name,
            })) || []}
            {...form.getInputProps('tags')}
          />}
          {
            isTagsLoading && <Loader type='dots' />
          }

          {
            isTagsError && <div>Failed to load tags</div>
          }

          <RichTextEditor editor={editor}>
            <RichTextEditor.Toolbar sticky stickyOffset={60}>
              <RichTextEditor.ControlsGroup>
                <RichTextEditor.Bold />
                <RichTextEditor.Italic />
                <RichTextEditor.Link />
                <RichTextEditor.Underline />
                <RichTextEditor.H1 />
                <RichTextEditor.H2 />
                <RichTextEditor.BulletList />
                <RichTextEditor.OrderedList />
              </RichTextEditor.ControlsGroup>
            </RichTextEditor.Toolbar>

            <RichTextEditor.Content />
          </RichTextEditor>

          <Switch
            label="Publish immediately"
            {...form.getInputProps('isPublished', { type: 'checkbox' })}
            mt="md"
          />

          <Button type="submit">
            {isEditing ? 'Update Blog' : 'Create Blog'}
          </Button>
        </Stack>
      </form>
    </Container>
  );
}