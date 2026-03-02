const Notification = require('../models/notificationModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getMyNotifications = catchAsync(async (req, res) => {
  const notifications = await Notification.find({ recipient: req.user._id })
    .sort('-createdAt')
    .populate('sender', 'name photo');

  res.status(200).json({
    status: 'success',
    results: notifications.length,
    data: { notifications },
  });
});

exports.markAsRead = catchAsync(async (req, res, next) => {
  const notificationId = req.params.id;

  const notification = await Notification.findOneAndUpdate(
    { _id: notificationId, recipient: req.user._id },
    { isRead: true },
    { new: true },
  );

  if (!notification) {
    return next(new AppError('Notification not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: { notification },
  });
});

exports.markAsReadAll = catchAsync(async (req, res) => {
  await Notification.updateMany(
    { recipient: req.user._id, isRead: false },
    { isRead: true },
  );

  res.status(200).json({
    status: 'success',
    message: 'All notifications marked as read',
  });
});
