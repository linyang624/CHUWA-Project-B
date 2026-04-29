import express from "express";
import {
  getMyProfile,
  updateProfileSection,
} from "../controllers/profileController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/me", protect, getMyProfile);
router.put("/me/section/:section", protect, updateProfileSection);

export default router;