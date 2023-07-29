const User = require("../models/userShm");
const fs = require("fs/promises");
const Jimp = require("jimp");
const path = require("path");
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { controlWrapper } = require("../decorators");
const { httpErrHandler, cloudinary, sendEmail } = require("../helpers");
const { nanoid } = require("nanoid");
const { SECRET_KEY, BASE_URL } = process.env;

const avatarsPath = path.resolve("public", "avatars");

const register = async (req, res) => {
  const { email, password } = req.body;
  console.log("email: ", email);

  const user = await User.findOne({ email });
  if (user) {
    throw httpErrHandler(409, "Email in use");
  }
  const verificationToken = nanoid();

  const hashPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
  const avatarUrl = gravatar.url(email);
  const result = await User.create({ email, password: hashPassword, verificationToken, avatarURL: avatarUrl });

  const verifyEmail = {
    to: email,
    subject: "Verify email",
    html: `<a target="_blank" href="${BASE_URL}/api/users/verify/${verificationToken}">Click to verify email</a>`,
  };

  await sendEmail(verifyEmail);

  const payload = {
    id: result._id,
  };

  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "24h" });
  await User.findByIdAndUpdate(result._id, { token });

  const returnedUser = await User.findById(payload.id);

  res.status(201).json({
    token: returnedUser.token,
    user: {
      email: returnedUser.email,
      subscription: returnedUser.subscription,
      avatarUrl: returnedUser.avatarURL,
    },
  });
};

const verifyByCode = async (req, res) => {
  const { verificationToken } = req.params;
  const user = await User.findOne({ verificationToken });
  if (!user) {
    throw httpErrHandler(401);
  }
  await User.findByIdAndUpdate(user._id, { verify: true, verificationToken: "" });
  res.status(200).json({
    message: "Verification successful",
  });
};

const verifyByEmail = async (req, res) => {
  const { email } = req.body;
  console.log(req);

  const user = await User.findOne({ email });
  console.log("user: ", user);

  if (!user) {
    throw httpErrHandler(401);
  }

  if (user.verify) throw httpErrHandler(400, "Verification has already been passed");

  const verifyEmail = {
    to: email,
    subject: "Verify email",
    html: `<a target="_blank" href="${BASE_URL}/api/users/verify/${user.verificationToken}">Click to verify email</a>`,
  };

  await sendEmail(verifyEmail);
  res.json({ message: "Verification email sent" });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw httpErrHandler(401, "Email or password is wrong");
  }
  const passCompare = bcrypt.compareSync(password, user.password);
  if (!passCompare) {
    throw httpErrHandler(401, "Email or password is wrong");
  }

  if (!user.verify) {
    throw httpErrHandler(401, "Email is not varified");
  }

  const payload = {
    id: user._id,
  };
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "24h" });
  const returnedUser = await User.findByIdAndUpdate(user._id, { token });
  res.status(200).json({
    token,
    user: {
      eamil: returnedUser.email,
      subscription: returnedUser.subscription,
      avatarUrl: returnedUser.avatarURL,
    },
  });
};

const getCurrent = async (req, res) => {
  const { email } = req.user;
  const user = await User.findOne({ email });
  res.status(200).json({
    user: {
      eamil: user.email,
      subscription: user.subscription,
      avatarUrl: user.avatarURL,
      avatarCloudURL: user.avatarCloudURL,
    },
  });
};

const logOut = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: null });
  res.status(204).json({
    message: "No Content",
  });
};
const subscriptionUpdata = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, req.body, { new: true });
  res.status(200).json({
    message: "Subscription updated",
  });
};
const avatarUpdata = async (req, res) => {
  const { _id } = req.user;

  const { path: oldPath, filename } = req.file;
  const newPath = path.join(avatarsPath, filename);
  await Jimp.read(oldPath)
    .then(avatar => {
      return avatar
        .resize(256, 256)
        .quality(60) // set JPEG quality
        .write(oldPath); // save
    })
    .catch(err => {
      console.error(err);
    });
  await fs.rename(oldPath, newPath);
  const fileData = await cloudinary.uploader.upload(newPath, {
    folder: "avatars",
  });
  const avatarCloudURL = fileData.url;
  const avatarURL = path.join("public", "avatars", filename);
  await User.findByIdAndUpdate(_id, { avatarURL, avatarCloudURL }, { new: true });
  res.status(200).json({
    message: "Avatar updated",
  });
};

module.exports = {
  register: controlWrapper(register),
  verifyByCode: controlWrapper(verifyByCode),
  verifyByEmail: controlWrapper(verifyByEmail),
  login: controlWrapper(login),
  getCurrent: controlWrapper(getCurrent),
  logOut: controlWrapper(logOut),
  subscriptionUpdata: controlWrapper(subscriptionUpdata),
  avatarUpdata: controlWrapper(avatarUpdata),
};
