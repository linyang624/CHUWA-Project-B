import path from "path";
import fs from "fs";

import Document from "../models/Document.js";
import { NotFoundError, ForbiddenError } from "../utils/error.js";

// Check whether current user can access this document
const checkDocumentAccess = (document, user) => {
    const isHR = user.role === "hr";
    const isOwner = document.user.toString() === user._id.toString();

    if (!isHR && !isOwner) {
        throw new ForbiddenError("You do not have permission to access this document");
    }
};

// Preview document in browser
export const previewDocument = async (req, res, next) => {
    try {
        const { documentId } = req.params;

        const document = await Document.findById(documentId);

        if (!document) {
            throw new NotFoundError("Document not found");
        }

        checkDocumentAccess(document, req.user);

        const filePath = path.resolve(document.filePath);

        if (!fs.existsSync(filePath)) {
            throw new NotFoundError("File not found");
        }

        res.setHeader("Content-Type", document.mimeType);
        res.setHeader(
            "Content-Disposition",
            `inline; filename="${document.originalName}"`
        );

        res.sendFile(filePath);
    } catch (error) {
        next(error);
    }
};

// Download document
export const downloadDocument = async (req, res, next) => {
    try {
        const { documentId } = req.params;

        const document = await Document.findById(documentId);

        if (!document) {
            throw new NotFoundError("Document not found");
        }

        checkDocumentAccess(document, req.user);

        const filePath = path.resolve(document.filePath);

        if (!fs.existsSync(filePath)) {
            throw new NotFoundError("File not found");
        }

        res.download(filePath, document.originalName);
    } catch (error) {
        next(error);
    }
};

