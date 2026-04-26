/* 
    Real file is saved in uploads folder
    This model only stores file information in MongoDB
*/

import mongoose from "mongoose";

const documentSchema = new mongoose.Schema (
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        documentType: {
            type: String,
            required: true,
            enum: [
                'opt_receipt',
                'opt_ead',
                'i_983',
                'i_20',
            ],
        },
        originalName: {
            type: String,
            required: true,
        },
        fileName: {
            type: String,
            required: true,
        },
        filePath: {
            type: String,
            required: true,
        },
        mimeType:{
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ['pending', 'approved', 'rejected'],
            default: 'pending',
        },
        feedback: {
            type: String,
            default: '',
        },
    },
    {
        timestamps: true,
    }
);

const Document = mongoose.model('Document', documentSchema);

export default Document;