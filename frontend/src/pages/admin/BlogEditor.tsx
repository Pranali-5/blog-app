import { useForm } from '@mantine/form';
import { RichTextEditor } from '@mantine/tiptap';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Container, TextInput, Button, MultiSelect } from '@mantine/core';
import { useMutation, useQuery } from '@tanstack/react-query';
import { blogService } from '../../api/blogService';
import React from 'react';

export function BlogEditor() {
  const { data: tags } = useQuery({
    queryKey: ['tags'],
    queryFn: blogService.getTags,
  });

  const form = useForm({
    initialValues: {
      title: '',
      content: '',
      tags: [],
      coverImageURL: '',
    },
  });

  const editor = useEditor({
    extensions: [StarterKit],
    content: '',
    onUpdate: ({ editor }) => {
      form.setFieldValue('content', editor.getHTML());
    },
  });

  const createBlogMutation = useMutation({
    mutationFn: blogService.createBlog,
  });

  return (
    <Container size="lg" py="xl">
      <form onSubmit={form.onSubmit((values) => createBlogMutation.mutate(values))}>
        <TextInput
          label="Title"
          placeholder="Blog title"
          {...form.getInputProps('title')}
        />

        <TextInput
          label="Cover Image URL"
          placeholder="https://..."
          mt="md"
          {...form.getInputProps('coverImageURL')}
        />

        <MultiSelect
          label="Tags"
          data={tags?.map((tag: any) => ({ value: tag._id, label: tag.name })) || []}
          placeholder="Select tags"
          mt="md"
          {...form.getInputProps('tags')}
        />

        <RichTextEditor editor={editor} mt="md" children={undefined} />

        <Button type="submit" mt="xl">
          Publish Blog
        </Button>
      </form>
    </Container>
  );
}