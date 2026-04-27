import express from "express";
import {
  getProfile,
  updateProfile,
} from "../controllers/profileController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/me", protect, getProfile);  // GET
router.put("/me", protect, updateProfile);  // UPDATE

export default router;