import express from "express";

import { protect } from "../middlewares/authMiddleware.js";

import {
    previewDocument,
    downloadDocument,
} from "../controllers/documentController.js";

const router = express.Router();

// Preview document in browser
router.get(
    "/:documentId/preview",
    protect,
    previewDocument
);

// Download document
router.get(
    "/:documentId/download",
    protect,
    downloadDocument
);

export default router;