const { Schema, model } = require('mongoose');
const { USER_ROLE, ADMIN_ROLE } = require('../constant/user');
const validator = require('validator');

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Invalid email address'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
  },
  role: {
    type: String,
    enum: [USER_ROLE, ADMIN_ROLE],
    default: USER_ROLE,
  }
}, { timestamps: true });

const User = model('user', userSchema);
module.exports = User;