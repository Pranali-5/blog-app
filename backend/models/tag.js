const { Schema, model } = require('mongoose');

const tagSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  slug: {
    type: String,
    required: true,
    unique: true
  }
}, { timestamps: true });

const Tag = model('Tag', tagSchema);
module.exports = Tag; 