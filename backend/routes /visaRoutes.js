import express from "express";

import { protect } from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";
import upload from "../middlewares/uploadMiddleware.js";

import {
    getMyVisaStatus,
    uploadVisaDocument,
} from "../controllers/visaController.js";

const router = express.Router();

// Employee gets their own visa status
router.get(
    "/me",
    protect,
    authorizeRoles("employee"),
    getMyVisaStatus
);

// Employee uploads next visa documents after OPT Receipt is approved
// documentType should be opt_ead, i_983, or i_20
router.post(
    "/upload/:documentType",
    protect,
    authorizeRoles("employee"),
    upload.single("file"),
    uploadVisaDocument
);

export default router;