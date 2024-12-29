const { Schema, model } = require('mongoose');

const blogSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    coverImageURL: {
      type: String,
      required: false,
    },
    excerpt: {
      type: String,
      required: true,
    },
    tags: [{ type: Schema.Types.ObjectId, ref: 'Tag'}],
    isPublished: {
      type: Boolean,
      default: false,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    }
  },
  { timestamps: true }
);

const Blog = model('blog', blogSchema);
module.exports = Blog;
