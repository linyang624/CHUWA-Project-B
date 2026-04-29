import express from "express";
import {
  getMyApplication,
  submitApplication,
  resubmitApplication,
} from "../controllers/onboardingController.js";
import { protect } from "../middlewares/authMiddleware.js";
import upload from "../middlewares/uploadMiddleware.js";

const router = express.Router();

const onboardingUpload = upload.fields([
  { name: "profilePicture", maxCount: 1 },
  { name: "driverLicense", maxCount: 1 },
  { name: "optReceipt", maxCount: 1 },
]);

router.get("/me", protect, getMyApplication);

router.post("/submit", protect, onboardingUpload, submitApplication);

router.put("/resubmit", protect, onboardingUpload, resubmitApplication);

export default router;