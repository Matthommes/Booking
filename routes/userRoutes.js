const express = require("express");
const {
  registerUser,
  confirmEmail,
  loginUser,
  forgotPassword,
  resetPassword,
} = require("../controllers/userController");
const { protect } = require("../Middlewares/authMiddleware");
const router = express.Router();

router.post("/register", registerUser);
router.post("/confirm-email/:id", confirmEmail);
router.post("/login", loginUser);
router.post("/forgot", forgotPassword);
router.post("/reset", resetPassword);

module.exports = router;
