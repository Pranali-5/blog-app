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

const { S3 } = require('@aws-sdk/client-s3');
const multerS3 = require('multer-s3');
const multer = require('multer');

const s3 = new S3({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const router = Router();

router.get('/', handleGetBlogs);
router.get('/tags', handleGetTags);
router.post('/tags', authMiddleware, adminMiddleware, handleCreateTag);
router.get('/unpublished', authMiddleware, adminMiddleware, handleGetUnpublishedBlogs);

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new Error('Not an image! Please upload only images.', 400), false);
  }
}

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_S3_BUCKET_NAME,
    // acl: 'public-read',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: (req, file, cb) => {
      cb(null, `public/img/${Date.now().toString()}-${file.originalname}`);
    },
  }),
  fileFilter: multerFilter,
});

router.get('/:id', handleGetBlogById);

router.post('/', authMiddleware, adminMiddleware, upload.single('coverImageURL'), handleCreateBlog);
router.put('/:id', authMiddleware, adminMiddleware, upload.single('coverImageURL'), handleUpdateBlog);
router.delete('/:id', authMiddleware, adminMiddleware, handleDeleteBlog);

module.exports = router;
