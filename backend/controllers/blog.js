const { ADMIN_ROLE } = require('../constant/user');
const Blog = require('../models/blog');
const Tag = require('../models/tag');

const slugify = require('slugify');

// Get all published blogs
async function handleGetBlogs(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const blogs = await Blog.find({ isPublished: true })
      .populate('tags', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit).exec();

    const total = await Blog.countDocuments({ isPublished: true });

    return res.status(200).json({
      blogs,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      total,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

// Get blog by ID with recent and related posts
async function handleGetBlogById(req, res) {
  try {
    const blog = await Blog.findById(req.params.id)
      .populate('tags', 'name').exec();

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    // Get 5 recent blogs
    const recentBlogs = await Blog.find({
      _id: { $ne: blog._id },
      isPublished: true,
    })
      .sort({ createdAt: -1 })
      .limit(5)
      .exec();

    // Get related posts based on tags
    const relatedBlogs = await Blog.find({
      _id: { $ne: blog._id },
      tags: { $in: blog.tags },
      isPublished: true,
    })
      .limit(6)
      .exec();

    return res.status(200).json({
      blog,
      recentBlogs,
      relatedBlogs,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

// Admin only - Create blog
async function handleCreateBlog(req, res) {
  try {
    const { title, content, tags } = req.body;
    
    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }

    // Validate tags if provided
    if (tags) {
      if (!Array.isArray(tags)) {
        return res.status(400).json({ message: 'Tags must be an array' });
      }
      // Verify all tags exist
      const existingTags = await Tag.find({ _id: { $in: tags } });
      if (existingTags.length !== tags.length) {
        return res.status(400).json({ message: 'Tags are invalid' });
      }
    }

    const slug = slugify(title, { lower: true });
    
    const blog = await Blog.create({
      ...req.body,
      slug,
      author: req.user._id,
      excerpt: req.body.excerpt || content.substring(0, 150) + '...',
      coverImageURL: req.file ? req.file.filename : null
    });

    return res.status(201).json(blog);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

// Admin only - Update blog
async function handleUpdateBlog(req, res) {
  try {
    if (req.user.role !== ADMIN_ROLE) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const { title, tags } = req.body;

    if (!Object.keys(req.body).length) {
      return res.status(400).json({ message: 'No update fields provided' });
    }

    if (tags) {
      if (!Array.isArray(tags)) {
        return res.status(400).json({ message: 'Tags must be an array' });
      }
      const existingTags = await Tag.find({ _id: { $in: tags } });
      if (existingTags.length !== tags.length) {
        return res.status(400).json({ message: 'One or more tags are invalid' });
      }
    }

    const updates = { ...req.body };
    if (title) {
      updates.slug = slugify(title, { lower: true });
    }

    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true }
    );

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    return res.status(200).json(blog);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

// Admin only - Delete blog
async function handleDeleteBlog(req, res) {
  try {
    if (req.user.role !== ADMIN_ROLE) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: 'Blog ID is required' });
    }

    if (!require('mongoose').Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid blog ID format' });
    }

    const blog = await Blog.findByIdAndDelete(id);

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    return res.status(200).json({ message: 'Blog deleted successfully' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

async function handleCreateTag(req, res) {
  try {
    const { name } = req.body;
    
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return res.status(400).json({ message: 'Valid tag name is required' });
    }

    // Check if tag already exists
    const existingTag = await Tag.findOne({ name: name.trim() });
    if (existingTag) {
      return res.status(400).json({ message: 'Tag already exists' });
    }

    const slug = slugify(name, { lower: true });
    
    const tag = await Tag.create({
      name,
      slug
    });
    
    return res.status(201).json(tag);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

// Get all tags
async function handleGetTags(req, res) {
  try {
    const tags = await Tag.find()
      .sort({ name: 1 })
      .select('name slug')
      .exec();

    return res.status(200).json(tags);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

// Add this new function
async function handleGetUnpublishedBlogs(req, res) {
  try {
    const blogs = await Blog.find({ isPublished: false })
      .populate('tags', 'name')
      .sort({ createdAt: -1 })
      .exec();

    return res.status(200).json(blogs);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

module.exports = {
  handleGetBlogs,
  handleGetBlogById,
  handleCreateBlog,
  handleUpdateBlog,
  handleDeleteBlog,
  handleCreateTag,
  handleGetTags,
  handleGetUnpublishedBlogs,
};
