const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const User = require('../models/userModel');
const Friendship = require('../models/friendshipModel');

exports.sendRequest = catchAsync(async (req, res, next) => {
  const recipientId = req.params.userId;
  const requesterId = req.user._id.toString();

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

exports.acceptRequest = catchAsync(async (req, res, next) => {
  const requesterId = req.params.userId;
  const recipientId = req.user._id;

  const friendship = await Friendship.findOneAndUpdate(
    {
      requester: requesterId,
      recipient: recipientId,
      status: 'pending',
    },
    { status: 'accepted' },
    { new: true },
  );

  if (!friendship) {
    return next(
      new AppError('Friend request not found or already processed', 404),
    );
  }

  res.status(200).json({
    status: 'success',
    message: 'Friend request accepted',
    data: { friendship },
  });
});

exports.rejectRequest = catchAsync(async (req, res, next) => {
  const requesterId = req.params.userId;
  const recipientId = req.user._id;

  const friendship = await Friendship.findOneAndDelete({
    requester: requesterId,
    recipient: recipientId,
    status: 'pending',
  });

  if (!friendship) {
    return next(new AppError('Friend request not found', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.removeFriend = catchAsync(async (req, res, next) => {
  const friendId = req.params.userId;
  const myId = req.user._id;

  const friendship = await Friendship.findOneAndDelete({
    $or: [
      { requester: myId, recipient: friendId },
      { requester: friendId, recipient: myId },
    ],
    status: 'accepted',
  });

  if (!friendship) {
    return next(new AppError('You are not friends with this user', 400));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.getIncomingRequests = catchAsync(async (req, res) => {
  const userId = req.user._id;

  const requests = await Friendship.find({
    recipient: userId,
    status: 'pending',
  }).populate('requester', 'name email photo');

  res.status(200).json({
    status: 'success',
    results: requests.length,
    data: { requests },
  });
});

exports.getMyFriends = catchAsync(async (req, res, next) => {
  const userId = req.user._id;

  const friendships = await Friendship.find({
    $or: [
      { requester: userId, status: 'accepted' },
      { recipient: userId, status: 'accepted' },
    ],
  })
    .populate('requester', 'name email photo')
    .populate('recipient', 'name email photo');

  if (!friendships) {
    return next(new AppError('Send friendship request to somebody', 404));
  }

  const friends = friendships.map((friendship) => {
    if (friendship.requester._id.toString() === userId) {
      return friendship.recipient;
    }
    return friendship.requester;
  });

  res.status(200).json({
    status: 'success',
    results: friends.length,
    data: { friends },
  });
});
