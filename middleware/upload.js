const multer = require("multer");
const path = require("path");

const tempDir = path.resolve("temp");

const multerConfig = multer.diskStorage({
  destination: tempDir,
  filename: (req, file, cb) => {
    const { _id } = req.user;
    const uniqueAvatarName = `${_id}_${file.originalname}`;
    cb(null, uniqueAvatarName);
  },
  limits: {
    fileSize: 1048576,
  },
});

const upload = multer({
  storage: multerConfig,
});

module.exports = upload;
