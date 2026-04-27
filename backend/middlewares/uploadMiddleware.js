/*
    upload document middleware:
    receive doc -> store doc to upload folder -> auto generate unique fileName 
*/

import multer from "multer";
import path from "path";
import fs from "fs";

// Folder used to store uploaded files
const uploadDir = "uploads";

// Create uploads folder if it does not exis
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Set where and how uploaded files should be stored
const storage = multer.diskStorage({
    // Where: Save files into uploads folde
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },

    // Name: Generate a unique file name to avoid duplicate names
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname);
        const baseName = path.basename(file.originalname, ext);

        cb(null, `${baseName}-${uniqueSuffix}${ext}`);
    },
});

// Check if the uploaded file type is allowed
const fileFilter = (req, file, cb) => {
    const allowedTypes = [
        "application/pdf",
        "image/jpeg",
        "image/png",
        "image/jpg",
    ];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    }
    else {
        cb(new Error("Only PDF, JPG, JPEG, and PNG files are allowed"), false);
    }
};

// Create multer upload middleware
const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
});

export default upload;