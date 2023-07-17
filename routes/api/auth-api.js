const express = require("express");
const { userRegisterJoi, userLoginJoi, userSubscription } = require("../../schemas/users-vldtn");
const { validateRqBody } = require("../../decorators");
const authController = require("../../controllers/auth-ctrl");
const auth = require("../../middleware/auth-mw");
const router = express.Router();

router.post("/register", validateRqBody(userRegisterJoi), authController.register);
router.post("/login", validateRqBody(userLoginJoi), authController.login);
router.get("/current", auth, authController.getCurrent);
router.post("/logout", auth, authController.logOut);
router.patch("/subscription", auth, validateRqBody(userSubscription), authController.subscriptionUpdata);
module.exports = router;
