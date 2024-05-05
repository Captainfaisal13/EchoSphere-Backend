const { StatusCodes } = require("http-status-codes");

const User = require("../models/User");
const { BadRequestError, UnauthorizedError } = require("../errors");
const Tweet = require("../models/Tweet");

const signUp = async (req, res) => {
  const user = await User.create({ ...req.body });
  const token = user.createJWT();

  res.status(StatusCodes.CREATED).json({
    user: {
      name: user.name,
      username: user.username,
      email: user.email,
      token,
    },
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError("Please provide email and password");
  }

  // check if user is registered using email
  const user = await User.findOne({ email });

  if (!user) {
    throw new UnauthorizedError("Invalid Credentials");
  }

  const isPasswordCorrect = await user.comparePassword(password);

  if (!isPasswordCorrect) {
    throw new UnauthorizedError("Invalid Password");
  }

  // compare password

  const token = user.createJWT();
  return res.status(StatusCodes.OK).json({
    user: {
      name: user.name,
      username: user.username,
      email: user.email,
      token,
    },
  });
};

const updateUser = async (req, res) => {
  const bodyFields = req.body;
  const filesFields = req.files;
  const user = await User.findOne({ _id: req.user.userId });

  if (bodyFields.email) {
    user.email = bodyFields.email;
  }

  if (bodyFields.username) {
    user.username = bodyFields.username;
  }

  if (bodyFields.name) {
    user.name = bodyFields.name;
  }

  if (bodyFields.bio) {
    user.bio = bodyFields.bio;
  }

  if (filesFields && filesFields.avatar) {
    user.avatar = await user.uploadFile(filesFields.avatar[0].path, "avatar");
  }

  if (filesFields && filesFields.cover) {
    user.cover = await user.uploadFile(filesFields.cover[0].path, "cover");
  }

  await user.save();

  const userTweets = await Tweet.updateMany(
    { userId: req.user.userId },
    {
      $set: {
        userAvatar: user.avatar,
        userDisplayName: user.name,
        username: user.username,
      },
    }
  );

  console.log(userTweets);

  const token = user.createJWT();
  res.status(StatusCodes.CREATED).json({
    user: {
      name: user.name,
      username: user.username,
      email: user.email,
      bio: user.bio,
      avatar: user.avatar,
      cover: user.cover,
      token,
    },
  });
};

const getUser = async (req, res) => {
  const userId = req.body.id;
  const user = await User.findOne({ _id: userId });
  res.status(StatusCodes.CREATED).json({
    user: {
      name: user.name,
      username: user.username,
      email: user.email,
      bio: user.bio,
      avatar: user.avatar,
      cover: user.cover,
    },
  });
};

module.exports = { signUp, login, updateUser, getUser };
