import express from "express";
import {
  registerUser,
  confirmEmail,
  loginUser,
  forgotPassword,
  resetPassword,
} from "../controllers/userController.js";
// import { protect }  from "../Middlewares/authMiddleware";
const router = express.Router();

router.post("/register", registerUser);
router.post("/confirm-email/:id", confirmEmail);
router.post("/login", loginUser);
router.post("/forgot", forgotPassword);
router.post("/reset", resetPassword);

export default router;
