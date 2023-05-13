const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    //required: true,
  },
  phone: {
    type: String,
    //required: true,
  },
  location: {
    type: String,
    //required: true,
  },
  isPublic: {
    type: Boolean,
    default: false,
  },
  businessCards: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'BusinessCard',
    },
  ],
});

const businessCardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  expertise: [
    {
      type: String,
    },
  ],
  isPublic: {
    type: Boolean,
    default: false,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  qrCodeDataURL: String,
  bio: {
    type: String,
    default: ''
  },
  socialLinks: {
    facebook: {
      type: String,
      default: ''
    },
    twitter: {
      type: String,
      default: ''
    },
    linkedin: {
      type: String,
      default: ''
    },
    instagram: {
      type: String,
      default: ''
    }
  },
});

businessCardSchema.index({
  name: 'text',
  location: 'text',
  expertise: 'text',
});

const User = mongoose.model('User', userSchema);
const BusinessCard = mongoose.model('BusinessCard', businessCardSchema);

module.exports = { User, BusinessCard };
