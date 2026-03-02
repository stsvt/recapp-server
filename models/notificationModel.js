const mongoose = require('mongoose');

const schema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Notification must have a sender.'],
    },
    recipient: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Notification must have a recipient.'],
    },
    type: {
      type: String,
      enum: ['friend_request_received', 'friend_request_accepted'],
      required: [true, 'Notification must have a type.'],
    },
    message: {
      type: String,
      required: [true, 'Notification must have a message.'],
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

const Notification = mongoose.model('Notification', schema);
module.exports = Notification;
