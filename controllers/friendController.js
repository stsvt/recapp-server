const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const User = require('../models/userModel');
const Friendship = require('../models/friendshipModel');

exports.sendRequest = catchAsync(async (req, res, next) => {
  const { recipientId } = req.body;
  const requesterId = req.user.id;

  if (recipientId === requesterId) {
    return next(
      new AppError('You cannot send a friend request to yourself', 400),
    );
  }

  const recipient = await User.findById(recipientId);

  if (!recipient) {
    return next(new AppError('User not found', 404));
  }

  const existingFriendship = await Friendship.findOne({
    $or: [
      { requester: requesterId, recipient: recipientId },
      { requester: recipientId, recipient: requesterId },
    ],
  });

  if (existingFriendship) {
    if (existingFriendship.status === 'accepted') {
      return next(new AppError('You are already friends', 400));
    }

    if (existingFriendship.requester.toString() === requesterId) {
      return next(new AppError('Friend request already sent', 400));
    }

    if (existingFriendship.recipient.toString() === requesterId) {
      existingFriendship.status = 'accepted';
      await existingFriendship.save();

      return res.status(200).json({
        status: 'success',
        message: 'Friend request accepted automatically (mutual request)',
        data: { friendship: existingFriendship },
      });
    }
  }

  const friendship = await Friendship.create({
    requester: requesterId,
    recipient: recipientId,
    status: 'pending',
  });

  res.status(201).json({
    status: 'success',
    message: 'Friend request sent successfully',
    data: { friendship },
  });
});
