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

const AWS = require('aws-sdk');
const multerS3 = require('multer-s3');
const multer = require('multer');
const sharp = require('sharp')

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const router = Router();

router.get('/', handleGetBlogs);
router.get('/tags', handleGetTags);
router.post('/tags', authMiddleware, adminMiddleware, handleCreateTag);
router.get('/unpublished', authMiddleware, adminMiddleware, handleGetUnpublishedBlogs);

const storage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new Error('Not an image! Please upload only images.', 400), false);
  }
}

const upload = multer({ storage: storage, fileFilter: multerFilter  });

const resizeUserPhoto = async (req, res, next) => {
  if (!req.file) return next();

  // Resize the image
  const resizedImageBuffer = await sharp(req.file.buffer)
    // .resize(500, 500) // Resize to 500x500
    .jpeg({ quality: 90 })
    .toBuffer();

  // Upload the resized image to S3
  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: `public/img/${Date.now().toString()}-${req.file.originalname}`,
    Body: resizedImageBuffer,
    // ACL: 'public-read',
    ContentType: 'image/jpeg',
  };

  s3.upload(params, (err, data) => {
    if (err) {
      return next(err);
    }
    req.file.location = data.Location; // S3 URL
    next();
  });
};

router.get('/:id', handleGetBlogById);

router.post('/', authMiddleware, adminMiddleware, upload.single('coverImageURL'), resizeUserPhoto, handleCreateBlog);
router.put('/:id', authMiddleware, adminMiddleware,upload.single('coverImageURL'),resizeUserPhoto, handleUpdateBlog);
router.delete('/:id', authMiddleware, adminMiddleware, handleDeleteBlog);

module.exports = router;
