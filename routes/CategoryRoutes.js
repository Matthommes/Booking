import express from "express";
import {
  getAllCategories,
  createCategory,
} from "../controllers/categoryController.js";
import { protect } from "../Middlewares/authMiddleware.js";
const router = express.Router();

router.get("/", getAllCategories);
router.post("/create-category", protect, createCategory);

export default router;
