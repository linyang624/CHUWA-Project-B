import express from "express";
import { login, getMe, logout } from "../controllers/authController.js";
import { protect } from "../middlewares/authMiddleware.js";
// Auth routes define login/logout/current-user endpoints.
// Controllers contain the actual logic.
const router = express.Router();

router.post("/login", login);
router.get("/me", protect, getMe); // GET /api/auth/me
router.post("/logout", logout);

export default router;