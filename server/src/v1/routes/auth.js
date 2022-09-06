const router = require("express").Router();
const userController = require("../controllers/user");
const { body } = require("express-validator");
const validation = require("../handlers/validation");
const tokenHandler = require("../handlers/tokenHandler");
const User = require("../models/user");

router.post(
  "/register",
  body("username")
    .isLength({ min: 3 })
    .withMessage("[Server] Username must be at least 3 characters long"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("[Server] Password must be at least 8 characters long"),
  body("confirmPassword").custom((value, { req }) => {
    if (value != req.body.password) {
      throw Error("[Server] Passwords do not match");
    }
    return true;
  }),
  body("username").custom((value) => {
    return User.findOne({ username: value }).then((user) => {
      if (user) {
        return Promise.reject("[Server] Username already exists");
      }
    });
  }),
  validation.validate,
  userController.register
);

router.post(
  "/login",
  body("username")
    .isLength({ min: 3 })
    .withMessage("[Server] Username must be at least 3 characters long"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("[Server] Password must be at least 8 characters long"),
  validation.validate,
  userController.login
);

router.get("/verifyToken", tokenHandler.verifyToken, (req, res) => {
  res.status(200).json({ user: req.user });
});

module.exports = router;
