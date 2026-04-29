import express from "express";
import {
  verifyRegistrationToken,
  registerWithToken,
} from "../controllers/registrationController.js";

const router = express.Router();

router.get("/verify-token/:token", verifyRegistrationToken);
router.post("/register/:token", registerWithToken);

export default router;