import { useForm } from '@mantine/form';
import { RichTextEditor, Link } from '@mantine/tiptap';
import { useEditor } from '@tiptap/react';
import Highlight from '@tiptap/extension-highlight';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Superscript from '@tiptap/extension-superscript';
import SubScript from '@tiptap/extension-subscript';
import { Container, TextInput, Button, MultiSelect, Textarea, Group, Stack, Switch } from '@mantine/core';
import { useMutation, useQuery } from '@tanstack/react-query';
import { blogService } from '../../api/blogService';
import { notifications } from '@mantine/notifications';
import React, { useEffect } from 'react';
import { AxiosError } from 'axios';
import { useMediaQuery } from '@mantine/hooks';
import { useNavigate, useParams } from 'react-router-dom';

export function BlogEditor() {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const { data: blogData, isError: isBlogError, isFetched: isBlogFetched } = useQuery({
    queryKey: ['blog', id],
    queryFn: () => blogService.getBlogById(id!),
    enabled: isEditing, // Only fetch if editing
  });

  useEffect(() => {
    if (isBlogFetched) {
      form.setValues({
        title: blogData.blog.title,
        content: blogData.blog.content,
        excerpt: blogData.blog.excerpt,
        coverImageURL: null, // Handle file upload separately
        tags: blogData.blog.tags.map((tag: any) => tag._id),
        isPublished: blogData.blog.isPublished,
        newTag: '',
      });
    }
  }, [isBlogFetched]);

  const { data: tagsData, refetch: refetchTags, isError: isTagsError } = useQuery({
    queryKey: ['tags'],
    queryFn: blogService.getTags,
  });

  const form = useForm({
    initialValues: {
      title: '',
      content: '',
      excerpt: '',
      coverImageURL: null as File | null,
      tags: [] as string[],
      newTag: '',
      isPublished: true,
    },
  });

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link,
      Superscript,
      SubScript,
      Highlight,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
    ],
    content: '', //isEditing ? form.values.content :
    onUpdate: ({ editor }) => {
      form.setFieldValue('content', editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && isBlogFetched && isEditing) {
      editor.commands.setContent(blogData.blog.content);
      form.setFieldValue('coverImageURL', blogData.blog.coverImageURL);
    }
  }, [editor, isBlogFetched, isEditing]);


  const createBlogMutation = useMutation({
    mutationFn: async (values: any) => {
      if (isEditing) {
        return blogService.updateBlog(id!, {
          ...values,
          coverImageURL: values.coverImageURL ? values.coverImageURL : blogData.blog.coverImageURL, // Keep the existing image URL
        });
      }
      return blogService.createBlog(values);
    },
    onSuccess: () => {
      notifications.show({
        title: 'Success',
        message: isEditing ? 'Blog updated successfully!' : 'Blog created successfully!',
        color: 'green',
      });
      navigate('/');
      if (editor) {
        editor.commands.clearContent();
      }
    },
    onError: (error: any) => {
      notifications.show({
        title: 'Error',
        message: error.response?.data?.message || 'Failed to create blog',
        color: 'red',
      });
    },
  });

  const createTagMutation = useMutation({
    mutationFn: async (tagName: string) => {
      return blogService.createTag({ name: tagName });
    },
    onSuccess: (data) => {
      form.setFieldValue('tags', [...form.values.tags, data._id]);
      form.setFieldValue('newTag', '');
      refetchTags();
      notifications.show({
        title: 'Success',
        message: 'Tag created successfully!',
        color: 'green'
      });
    },
    onError: (error: AxiosError<{ message: string }>) => {
      notifications.show({
        title: 'Error',
        message: error.response?.data?.message || 'Failed to create tag',
        color: 'red'
      });
    }
  });

  const handleCreateTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.values.newTag) {
      createTagMutation.mutate(form.values.newTag);
    }
  };

  return (
    <Container size="lg" py="xl" w={isMobile ? '100%' : '50%'}>
      <form onSubmit={form.onSubmit((values) => createBlogMutation.mutate(values))}>
        <TextInput
          label="Title"
          placeholder="Blog title"
          required
          {...form.getInputProps('title')}
        />

        <TextInput
          label="Cover Image"
          placeholder="Upload cover image"
          type="file"
          onChange={(event) => {
            const file = event.currentTarget.files?.[0];
            if (file) {
              form.setFieldValue('coverImageURL', file);
            }
          }}
        />

        <Group align="flex-end">
          <MultiSelect
            label="Tags"
            placeholder="Select tags"
            data={tagsData?.map((tag: any) => ({
              value: tag._id,
              label: tag.name,
            })) || []}
            {...form.getInputProps('tags')}
            style={{ flex: 1 }}
          />
          <TextInput
            placeholder="New tag name"
            {...form.getInputProps('newTag')}
            style={{ flex: 1 }}
          />
          <Button onClick={handleCreateTag} disabled={!form.values.newTag}>
            Add Tag
          </Button>
        </Group>
        {isTagsError && <div>Failed to load tags</div>}

        <RichTextEditor editor={editor} mt="md">
          <RichTextEditor.Toolbar sticky stickyOffset={60}>
            <RichTextEditor.ControlsGroup>
              <RichTextEditor.Bold />
              <RichTextEditor.Italic />
              <RichTextEditor.Underline />
              <RichTextEditor.Strikethrough />
              <RichTextEditor.ClearFormatting />
              <RichTextEditor.Highlight />
              <RichTextEditor.Code />
            </RichTextEditor.ControlsGroup>

            <RichTextEditor.ControlsGroup>
              <RichTextEditor.H1 />
              <RichTextEditor.H2 />
              <RichTextEditor.H3 />
              <RichTextEditor.H4 />
            </RichTextEditor.ControlsGroup>

            <RichTextEditor.ControlsGroup>
              <RichTextEditor.Blockquote />
              <RichTextEditor.Hr />
              <RichTextEditor.BulletList />
              <RichTextEditor.OrderedList />
              <RichTextEditor.Subscript />
              <RichTextEditor.Superscript />
            </RichTextEditor.ControlsGroup>

            <RichTextEditor.ControlsGroup>
              <RichTextEditor.Link />
              <RichTextEditor.Unlink />
            </RichTextEditor.ControlsGroup>

            <RichTextEditor.ControlsGroup>
              <RichTextEditor.AlignLeft />
              <RichTextEditor.AlignCenter />
              <RichTextEditor.AlignJustify />
              <RichTextEditor.AlignRight />
            </RichTextEditor.ControlsGroup>

            <RichTextEditor.ControlsGroup>
              <RichTextEditor.Undo />
              <RichTextEditor.Redo />
            </RichTextEditor.ControlsGroup>
          </RichTextEditor.Toolbar>

          <RichTextEditor.Content />
        </RichTextEditor>
        <Switch
          label="Publish immediately"
          {...form.getInputProps('isPublished', { type: 'checkbox' })}
          mt="md"
        />
        <Button type="submit" mt="xl">
          Publish Blog
        </Button>
      </form>
    </Container>
  );
}