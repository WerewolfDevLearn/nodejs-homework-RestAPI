const express = require("express");
const { userRegisterJoi, userLoginJoi, userSubscription } = require("../../schemas/users-vldtn");
const { validateRqBody } = require("../../decorators");
const authController = require("../../controllers/auth-ctrl");
const auth = require("../../middleware/auth-mw");
const { upload } = require("../../middleware");
const router = express.Router();

router.post("/register", upload.single("avatar"), validateRqBody(userRegisterJoi), authController.register);
router.post("/login", validateRqBody(userLoginJoi), authController.login);
router.get("/current", auth, authController.getCurrent);
router.post("/logout", auth, authController.logOut);
router.patch("/subscription", auth, validateRqBody(userSubscription), authController.subscriptionUpdata);
router.patch("/avatars", auth, upload.single("avatar"), validateRqBody(userSubscription), authController.avatarUpdata);
router.get("/verify/:verificationToken", authController.verify);

module.exports = router;
