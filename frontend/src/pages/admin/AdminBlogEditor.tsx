import { TextInput, Textarea, Button, MultiSelect, Stack, Box, Group, Switch } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { blogService } from '../../api/blogService';
import { notifications } from '@mantine/notifications';
import { AxiosError } from 'axios';
import React, { useEffect } from 'react';
import { useMediaQuery } from '@mantine/hooks';

export function AdminBlogEditor() {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const form = useForm({
    initialValues: {
      title: '',
      content: '',
      excerpt: '',
      coverImageURL: null as File | null,
      tags: [] as string[],
      isPublished: true,
      newTag: '',
    },
  });

  const { data: blogData, isError: isBlogError } = useQuery({
    queryKey: ['blog', id],
    queryFn: () => blogService.getBlogById(id!),
    enabled: isEditing, // Only fetch if editing
  });

  useEffect(() => {
    if (blogData) {
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
  }, [blogData]);

  const { data: tagsData, refetch: refetchTags, isError: isTagsError } = useQuery({
    queryKey: ['tags'],
    queryFn: blogService.getTags,
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

  const createBlogMutation = useMutation({
    mutationFn: async (values: any) => {
      if (isEditing) {
        return blogService.updateBlog(id!, values);
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
    },
    onError: (error: AxiosError<{ message: string }>) => {
      notifications.show({
        title: 'Error',
        message: error.response?.data?.message || 'Failed to save blog',
        color: 'red',
      });
    },
  });

  const handleCreateTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.values.newTag) {
      createTagMutation.mutate(form.values.newTag);
    }
  };

  return (
    <Box w={isMobile ? '100%' : '50%'} p={`lg`} m='auto'>
      <form onSubmit={form.onSubmit((values) => createBlogMutation.mutate(values))} style={{ width: '100%' }}>
        <Stack gap="md" w="100%">
          <TextInput
            label="Title"
            placeholder="Enter blog title"
            required
            {...form.getInputProps('title')}
            w="100%"
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
            w="100%"
          />
          <Textarea
            label="Content"
            placeholder="Blog content"
            required
            {...form.getInputProps('content')}
            w="100%"
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
          <Switch
            label="Publish immediately"
            {...form.getInputProps('isPublished', { type: 'checkbox' })}
            mt="md"
          />
          <Button type="submit" w="100%">
            {isEditing ? 'Update Blog' : 'Create Blog'}
          </Button>
        </Stack>
      </form>
    </Box>
  );
}