/* 
    Visa Status Record
    This model tracks the employee's OPT visa document flow.

    OPT Receipt → OPT EAD → I-983 → I-20
*/
import mongoose from "mongoose";

const visaStatusSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
        },
        
        visaTitle: {
            type: String,
            required: true,
            enum: ["f1_cpt_opt"],
            default: "f1_cpt_opt",
        },

        startDate: {
            type: Date,
            required: true,
        },

        endDate: {
            type: Date,
            required: true,
        },

        currentStep: {
            type: String,
            enum: [
                "opt_receipt",
                "opt_ead",
                "i_983",
                "i_20",
                "completed",
            ],
            default: "opt_receipt",
        },

        optReceipt: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Document",
            default: null,
        },

        optEad: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Document",
            default: null,
        },

        i983: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Document",
            default: null,
        },

        i20: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Document",
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

const VisaStatus = mongoose.model("VisaStatus", visaStatusSchema);

export default VisaStatus;