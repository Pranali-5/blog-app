const { Router } = require('express');
const { 
  handleGetBlogs, 
  handleCreateBlog,
  handleGetBlogById,
  handleUpdateBlog,
  handleDeleteBlog,
  handleGetTags,
  handleCreateTag,
  handleGetUnpublishedBlogs,
} = require('../controllers/blog');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');
const multer = require('multer');
const sharp = require('sharp')
const router = Router();

router.get('/', handleGetBlogs);
router.get('/tags', handleGetTags);
router.post('/tags', authMiddleware, adminMiddleware, handleCreateTag);
router.get('/unpublished', authMiddleware, adminMiddleware, handleGetUnpublishedBlogs);

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, './uploads'),
//   filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
// });

const storage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new Error('Not an image! Please upload only images.', 400), false);
  }
}

const upload = multer({ storage, fileFilter: multerFilter });

const resizeUserPhoto = (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `${Date.now()}-${req.file.originalname}`;

  sharp(req.file.buffer)
    // .resize(500, 500)
    // .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/${req.file.filename}`);

  next();
}

router.get('/:id', handleGetBlogById);

router.post('/', authMiddleware, adminMiddleware, upload.single('coverImageURL'),resizeUserPhoto, handleCreateBlog);
router.put('/:id', authMiddleware, adminMiddleware,upload.single('coverImageURL'),resizeUserPhoto, handleUpdateBlog);
router.delete('/:id', authMiddleware, adminMiddleware, handleDeleteBlog);

module.exports = router;
