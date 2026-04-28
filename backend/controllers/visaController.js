import VisaStatus from "../models/VisaStatus.js";
import Document from "../models/Document.js";
import OnboardingApplication from "../models/OnboardingApplication.js";
import { NotFoundError, ValidationError, ForbiddenError } from "../utils/error.js";

// Helper: convert current step into readable document name
const getVisaDocumentName = (step) => {
    if (step === "opt_receipt") return "OPT Receipt";
    if (step === "opt_ead") return "OPT EAD";
    if (step === "i_983") return "I-983";
    if (step === "i_20") return "I-20";
    if (step === "completed") return "Completed";

    return "";
};

// Helper: get document object based on currentStep
const getCurrentVisaDocument = (visaStatus) => {
    if (visaStatus.currentStep === "opt_receipt") {
        return visaStatus.optReceipt;
    }

    if (visaStatus.currentStep === "opt_ead") {
        return visaStatus.optEad;
    }

    if (visaStatus.currentStep === "i_983") {
        return visaStatus.i983;
    }

    if (visaStatus.currentStep === "i_20") {
        return visaStatus.i20;
    }

    return null;
};

// Helper: generate employee-side message based on current step and document status
const getEmployeeVisaMessage = (visaStatus) => {
    if (visaStatus.currentStep === "completed") {
        return "All documents have been approved";
    }

    const currentDocument = getCurrentVisaDocument(visaStatus);
    const currentDocumentName = getVisaDocumentName(visaStatus.currentStep);

    if (!currentDocument) {
        return `Please upload your ${currentDocumentName}`;
    }

    if (currentDocument.status === "pending") {
        return `Waiting for HR to approve your ${currentDocumentName}`;
    }

    if (currentDocument.status === "rejected") {
        return `Your ${currentDocumentName} was rejected. Please review HR feedback and upload a new copy.`;
    }

    if (currentDocument.status === "approved") {
        if (visaStatus.currentStep === "opt_receipt") {
            return "Please upload a copy of your OPT EAD";
        }

        if (visaStatus.currentStep === "opt_ead") {
            return "Please download and fill out the I-983 form";
        }

        if (visaStatus.currentStep === "i_983") {
            return "Please send the I-983 along with all necessary documents to your school and upload the new I-20";
        }

        if (visaStatus.currentStep === "i_20") {
            return "All documents have been approved";
        }
    }

    return "Please check your visa status";
};

// Helper: create or update one visa document
const createOrUpdateDocument = async (userId, documentType, file) => {
    if (!file) {
        throw new ValidationError("File is required");
    }

    const document = await Document.findOneAndUpdate(
        {
            user: userId,
            documentType,
        },
        {
            user: userId,
            documentType,
            originalName: file.originalname,
            fileName: file.filename,
            filePath: file.path,
            mimeType: file.mimetype,
            status: "pending",
            feedback: "",
        },
        {
            new: true,
            upsert: true,
            runValidators: true,
        }
    );

    return document;
};

// GET /api/visa/me
// Employee gets their own OPT visa status
export const getMyVisaStatus = async (req, res, next) => {
    try {
        const application = await OnboardingApplication.findOne({
            user: req.user._id,
            status: "approved",
        });

        if (!application) {
            return res.status(200).json({
                showVisaStatus: false,
                message: "Your onboarding application has not been approved yet.",
                visaStatus: null,
            });
        }

        if (application.workAuthorization?.visaTitle !== "f1_cpt_opt") {
            return res.status(200).json({
                showVisaStatus: false,
                message: "Visa Status Management only applies to F1(CPT/OPT) employees.",
                visaStatus: null,
            });
        }

        const visaStatus = await VisaStatus.findOne({
            user: req.user._id,
        })
            .populate("optReceipt")
            .populate("optEad")
            .populate("i983")
            .populate("i20");

        if (!visaStatus) {
            throw new NotFoundError("Visa status record not found");
        }

        const currentDocument = getCurrentVisaDocument(visaStatus);

        res.status(200).json({
            showVisaStatus: true,
            currentStep: visaStatus.currentStep,
            currentDocumentName: getVisaDocumentName(visaStatus.currentStep),
            message: getEmployeeVisaMessage(visaStatus),
            feedback: currentDocument?.status === "rejected"
                ? currentDocument.feedback
                : "",
            visaStatus,
        });
    } catch (error) {
        next(error);
    }
};

// POST /api/visa/upload/:documentType
// Employee uploads OPT EAD / I-983 / I-20
export const uploadVisaDocument = async (req, res, next) => {
    try {
        const { documentType } = req.params;

        const allowedUploadTypes = ["opt_ead", "i_983", "i_20"];

        if (!allowedUploadTypes.includes(documentType)) {
            throw new ValidationError("Only OPT EAD, I-983, and I-20 can be uploaded on this page");
        }

        const visaStatus = await VisaStatus.findOne({
            user: req.user._id,
        })
            .populate("optReceipt")
            .populate("optEad")
            .populate("i983")
            .populate("i20");

        if (!visaStatus) {
            throw new NotFoundError("Visa status record not found");
        }

        if (visaStatus.currentStep === "completed") {
            throw new ValidationError("All visa documents have already been approved");
        }

        if (visaStatus.currentStep !== documentType) {
            throw new ForbiddenError(
                `You can only upload ${getVisaDocumentName(visaStatus.currentStep)} at this step`
            );
        }

        const file = req.file;

        if (!file) {
            throw new ValidationError("Please upload a file");
        }

        const document = await createOrUpdateDocument(
            req.user._id,
            documentType,
            file
        );

        if (documentType === "opt_ead") {
            visaStatus.optEad = document._id;
        } else if (documentType === "i_983") {
            visaStatus.i983 = document._id;
        } else if (documentType === "i_20") {
            visaStatus.i20 = document._id;
        }

        await visaStatus.save();

        res.status(200).json({
            message: `${getVisaDocumentName(documentType)} uploaded successfully. Waiting for HR approval.`,
            document,
            visaStatus,
        });
    } catch (error) {
        next(error);
    }
};