import { Router } from "express";
import { getUserProfile, updateUserProfile } from "../controllers/profileController.js";
import { protect } from "../Middlewares/authMiddleware.js";
const router = Router();


router.get("/", protect, getUserProfile)
router.put("/update", protect, updateUserProfile)

export default router;

 