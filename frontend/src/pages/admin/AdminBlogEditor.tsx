import { useForm } from '@mantine/form';
import { Container, TextInput, Textarea, Button, MultiSelect, Stack } from '@mantine/core';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { RichTextEditor, Link } from '@mantine/tiptap';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import React from 'react';

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
  const { data: tagsData } = useQuery({
    queryKey: ['tags'],
    queryFn: async () => {
      const response = await fetch('http://localhost:8080/api/blogs/tags');
      return response.json();
    },
  });

  const createBlogMutation = useMutation({
    mutationFn: async (values: typeof form.values) => {
      const response = await fetch('http://localhost:8080/api/blogs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add your auth token here
        },
        body: JSON.stringify(values),
      });
      return response.json();
    },
    onSuccess: () => {
      navigate('/');
    },
  });

  return (
    <Container size="lg">
      <form onSubmit={form.onSubmit((values) => createBlogMutation.mutate(values))}>
        <Stack gap="md">
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
            label="Excerpt"
            placeholder="Brief description of the blog"
            required
            {...form.getInputProps('excerpt')}
          />

          <MultiSelect
            label="Tags"
            placeholder="Select tags"
            data={tagsData?.tags?.map((tag: any) => ({
              value: tag._id,
              label: tag.name,
            })) || []}
            {...form.getInputProps('tags')}
          />

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

          <Button type="submit">
            {isEditing ? 'Update Blog' : 'Create Blog'}
          </Button>
        </Stack>
      </form>
    </Container>
  );
}