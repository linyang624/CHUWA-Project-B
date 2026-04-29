import express from "express";
import {
  getMyProfile,
  updateProfileSection,
  updateProfilePicture,
} from "../controllers/profileController.js";
import { protect } from "../middlewares/authMiddleware.js";
import upload from "../middlewares/uploadMiddleware.js";

const router = express.Router();

router.get("/me", protect, getMyProfile);

router.put("/me/section/:section", protect, updateProfileSection);

/*
  Employee updates profile picture after onboarding is approved.

  Frontend sends FormData:
  - profilePicture: file
*/
router.put(
  "/me/profile-picture",
  protect,
  upload.single("profilePicture"),
  updateProfilePicture
);

export default router;