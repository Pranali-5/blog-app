const { Router } = require('express');
const { 
  handleGetBlogs, 
  handleCreateBlog,
  handleGetBlogById,
  handleUpdateBlog,
  handleDeleteBlog,
  handleGetTags,
  handleCreateTag,
  handleGetUnpublishedBlogs
} = require('../controllers/blog');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

const router = Router();

router.get('/', handleGetBlogs);
router.get('/tags', handleGetTags);
router.post('/tags', authMiddleware, adminMiddleware, handleCreateTag);
router.get('/unpublished', authMiddleware, adminMiddleware, handleGetUnpublishedBlogs);
router.get('/:id', handleGetBlogById);

// Admin routes
router.post('/', authMiddleware, adminMiddleware, handleCreateBlog);
router.patch('/:id', authMiddleware, adminMiddleware, handleUpdateBlog);
router.delete('/:id', authMiddleware, adminMiddleware, handleDeleteBlog);

module.exports = router;
