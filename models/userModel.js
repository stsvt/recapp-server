const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please enter your name!'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please enter your email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please enter a valid email'],
  },
  password: {
    type: String,
    required: [true, 'Please enter your password '],
    minLength: 8,
  },
  confirmPassword: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      validator: function (el) {
        return this.password === el;
      },
      message: 'Passwords are not the same!',
    },
  },
  description: { type: String, maxLength: 300 },
  photo: String,
});

schema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.confirmPassword = undefined;
});

const User = mongoose.model('User', schema);

module.exports = User;
