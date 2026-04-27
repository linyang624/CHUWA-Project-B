import path from "path";
import Document from "../models/Document.js";

export const previewDocument = async (req, res, next) => {
    try {
        const document = await Document.findById(req.params.documentId);

        if (!document) {
            return res.status(404).json({ message: "Document not found" });
        }

        res.setHeader("Content-Type", document.mimeType);
        res.setHeader("Content-Disposition", "inline");

        res.sendFile(path.resolve(document.filePath));
    } catch (error) {
        next(error);
    }
};

export const downloadDocument = async (req, res, next) => {
    try {
        const document = await Document.findById(req.params.documentId);

        if (!document) {
            return res.status(404).json({ message: "Document not found" });
        }
        res.download(path.resolve(document.filePath), document.originalName);
        
    } catch (error) {
        next(error);
    }
};