import crypto from "crypto";

import OnboardingApplication from "../models/OnboardingApplication.js";
import VisaStatus from "../models/VisaStatus.js";
import RegistrationToken from "../models/RegistrationToken.js";
import Document from "../models/Document.js";
import { NotFoundError, ValidationError } from "../utils/error.js";
import sendEmail from "../utils/sendEmail.js";


// Generate registration token and registration link for a new employee
export const generateRegistrationToken = async (req, res, next) => {
    try {
        const { email, firstName, lastName } = req.body;

        if (!email || !firstName || !lastName) {
            throw new ValidationError("Email, first name, and last name are required");
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            throw new ValidationError("Invalid email format");
        }

        const normalizedEmail = email.toLowerCase();

        const token = crypto.randomBytes(32).toString("hex");

        const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
        const registrationLink = `${frontendUrl}/register/${token}`;

        const expiresAt = new Date(Date.now() + 3 * 60 * 60 * 1000);

        const registrationToken = await RegistrationToken.create({
            email: normalizedEmail,
            firstName,
            lastName,
            token,
            registrationLink,
            expiresAt,
            used: false,
            onboardingSubmitted: false,
        });

        await sendEmail({
            to: normalizedEmail,
            subject: "Your Employee Registration Link",
            text: `Hi ${firstName},

        Please use the link below to register your employee account.

        ${registrationLink}

        This registration link will expire in 3 hours.

        Best,
        HR Team`,
        });

        res.status(201).json({
            message: "Registration token generated and email sent successfully",
            registrationToken,
        });
    }
    catch (error) {
        next(error);
    }
};

// Get registration token history for HR
export const getRegistrationTokenHistory = async (req, res, next) => {
    try {
        const tokens = await RegistrationToken.find()
            .sort({ createdAt: -1 });

        const tokenHistory = tokens.map((tokenRecord) => {
            const isExpired = tokenRecord.expiresAt < new Date();

            return {
                _id: tokenRecord._id,
                email: tokenRecord.email,
                firstName: tokenRecord.firstName,
                lastName: tokenRecord.lastName,
                registrationLink: tokenRecord.registrationLink,
                expiresAt: tokenRecord.expiresAt,
                used: tokenRecord.used,
                onboardingSubmitted: tokenRecord.onboardingSubmitted,
                linkStatus: tokenRecord.used ? "used" : isExpired ? "expired" : "active",
            };
        });

        res.status(200).json({
            count: tokenHistory.length,
            tokens: tokenHistory,
        });
    }
    catch (error) {
        next(error);
    }
};

//HELPER: Get onboarding applications by status
const getApplicationsByStatus = async (status, res, next) => {
    try {
        const applications = await OnboardingApplication.find({ status })
            .populate("user", "username email")
            .sort({ createdAt: -1 })

        res.status(200).json({
            count: applications.length,
            applications,
        });
    }
    catch (error) {
        next(error);
    }
};

export const getPendingApplications = async (req, res, next) => {
    await getApplicationsByStatus("pending", res, next);
};

export const getRejectedApplications = async (req, res, next) => {
    await getApplicationsByStatus("rejected", res, next);
};

export const getApprovedApplications = async (req, res, next) => {
    await getApplicationsByStatus("approved", res, next);
};

// Get one onboarding application by application id
export const getApplicationById = async (req, res, next) => {
    try {
        const application = await OnboardingApplication.findById(req.params.id)
            .populate("user", "username email")
            .populate("profilePicture")
            .populate("driverLicense")
            .populate("workAuthorization.optReceipt");

        if (!application) {
            throw new NotFoundError("Onboarding application not found");
        }

        res.status(200).json({
            application,
        });
    }
    catch (error) {
        next(error);
    }
};

// Approve one onboarding application
export const approveApplication = async (req, res, next) => {
    try {
        const application = await OnboardingApplication.findById(req.params.id);

        if (!application) {
            throw new NotFoundError("Onboarding application not found");
        }

        application.status = "approved";
        application.feedback = "";

        if (application.workAuthorization.visaTitle === "f1_cpt_opt") {
            if (!application.workAuthorization.optReceipt) {
                throw new ValidationError("OPT Receipt is required for F1(CPT/OPT) employees");
            }

            const optReceiptDocument = await Document.findById(
                application.workAuthorization.optReceipt
            );

            if (!optReceiptDocument) {
                throw new NotFoundError("OPT Receipt document not found");
            }

            optReceiptDocument.status = "approved";
            optReceiptDocument.feedback = "";
            await optReceiptDocument.save();

            await VisaStatus.findOneAndUpdate(
                { user: application.user },
                {
                    user: application.user,
                    visaTitle: "f1_cpt_opt",
                    startDate: application.workAuthorization.startDate,
                    endDate: application.workAuthorization.endDate,
                    currentStep: "opt_ead",
                    optReceipt: application.workAuthorization.optReceipt,
                },
                {
                    new: true,
                    upsert: true,
                }
            );
        }

        const updatedApplication = await application.save();

        res.status(200).json({
            message: "Application approved successfully",
            application: updatedApplication,
        });
    } catch (error) {
        next(error);
    }
};

// Reject one onboarding application with HR feedback
export const rejectApplication = async (req, res, next) => {
    try {
        const { feedback } = req.body;

        if (!feedback) {
            throw new ValidationError("Feedback is required when rejecting an application");
        }

        const application = await OnboardingApplication.findById(req.params.id);

        if (!application) {
            throw new NotFoundError("Onboarding application not found");
        }

        application.status = "rejected";
        application.feedback = feedback;

        const updatedApplication = await application.save();

        res.status(200).json({
            message: "Application rejected successfully",
            application: updatedApplication,
        });
    }
    catch (error) {
        next(error);
    }
};

// Get employee profile summaries for HR
export const getEmployees = async (req, res, next) => {
    try {
        const { search } = req.query;

        const filter = {
            status: "approved",
        };

        if (search) {
            filter.$or = [
                { firstName: { $regex: search, $options: "i" } },
                { lastName: { $regex: search, $options: "i" } },
                { preferredName: { $regex: search, $options: "i" } },
            ];
        }

        const employees = await OnboardingApplication.find(filter)
            .populate("user", "username email")
            .sort({ lastName: 1, firstName: 1 });

        res.status(200).json({
            count: employees.length,
            employees,
        });
    }
    catch (error) {
        next(error);
    }
};

// Get one employee's full profile by employee user id
export const getEmployeeById = async (req, res, next) => {
    try {
        const { employeeId } = req.params;

        const employeeProfile = await OnboardingApplication.findOne({
            user: employeeId,
            status: "approved",
        })
            .populate("user", "username email")
            .populate("profilePicture")
            .populate("driverLicense")
            .populate("workAuthorization.optReceipt");

        if (!employeeProfile) {
            throw new NotFoundError("Employee profile not found");
        }

        res.status(200).json({
            employee: employeeProfile,
        });
    }
    catch (error) {
        next(error);
    }
};

// Helper: get the current document based on currentStep
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

// Helper: convert document type into readable name
const getVisaDocumentName = (step) => {
    if (step === "opt_receipt") return "OPT Receipt";
    if (step === "opt_ead") return "OPT EAD";
    if (step === "i_983") return "I-983";
    if (step === "i_20") return "I-20";

    return "";
};

// Helper: calculate days remaining based on visa end date
const getDaysRemaining = (endDate) => {
    if (!endDate) return null;

    const today = new Date();
    const end = new Date(endDate);

    return Math.ceil((end - today) / (1000 * 60 * 60 * 24));
};

// Helper: generate next step text for HR visa table
const getVisaNextStep = (visaStatus) => {
    if (visaStatus.currentStep === "completed") {
        return "Finished";
    }

    const currentDocument = getCurrentVisaDocument(visaStatus);
    const currentDocumentName = getVisaDocumentName(visaStatus.currentStep);

    if (!currentDocument) {
        return `Waiting for employee to upload ${currentDocumentName}`;
    }

    if (currentDocument.status === "pending") {
        return `Waiting for HR to review ${currentDocumentName}`;
    }

    if (currentDocument.status === "rejected") {
        return `Waiting for employee to re-upload ${currentDocumentName}`;
    }

    if (currentDocument.status === "approved") {
        return `Waiting for employee to upload next document`;
    }

    return "Check visa status";
};

// Helper: decide what HR action should show on frontend
const getVisaActionType = (visaStatus) => {
    if (visaStatus.currentStep === "completed") {
        return "none";
    }

    const currentDocument = getCurrentVisaDocument(visaStatus);

    if (!currentDocument) {
        return "send_notification";
    }

    if (currentDocument.status === "pending") {
        return "review_document";
    }

    if (currentDocument.status === "rejected") {
        return "send_notification";
    }

    if (currentDocument.status === "approved") {
        return "send_notification";
    }

    return "none";
};

// Helper: return only approved documents for All tab
const getApprovedVisaDocuments = (visaStatus) => {
    const documents = [];

    if (visaStatus.optReceipt?.status === "approved") {
        documents.push({
            type: "opt_receipt",
            label: "OPT Receipt",
            document: visaStatus.optReceipt,
        });
    }

    if (visaStatus.optEad?.status === "approved") {
        documents.push({
            type: "opt_ead",
            label: "OPT EAD",
            document: visaStatus.optEad,
        });
    }

    if (visaStatus.i983?.status === "approved") {
        documents.push({
            type: "i_983",
            label: "I-983",
            document: visaStatus.i983,
        });
    }

    if (visaStatus.i20?.status === "approved") {
        documents.push({
            type: "i_20",
            label: "I-20",
            document: visaStatus.i20,
        });
    }

    return documents;
};

// Get all OPT employees whose visa process is not completed
export const getVisaInProgress = async (req, res, next) => {
    try {
        const visaStatuses = await VisaStatus.find({
            currentStep: { $ne: "completed" },
        })
            .populate("user", "username email")
            .populate("optReceipt")
            .populate("optEad")
            .populate("i983")
            .populate("i20")
            .sort({ updatedAt: -1 });

        const userIds = visaStatuses.map((visaStatus) => visaStatus.user._id);

        const applications = await OnboardingApplication.find({
            user: { $in: userIds },
            status: "approved",
        });

        const applicationMap = new Map();

        applications.forEach((application) => {
            applicationMap.set(application.user.toString(), application);
        });

        const inProgress = visaStatuses
            .filter((visaStatus) =>
                applicationMap.has(visaStatus.user._id.toString())
            )
            .map((visaStatus) => {
                const application = applicationMap.get(visaStatus.user._id.toString());
                const currentDocument = getCurrentVisaDocument(visaStatus);

                return {
                    visaStatusId: visaStatus._id,
                    employeeId: visaStatus.user._id,
                    username: visaStatus.user.username,
                    email: visaStatus.user.email,

                    legalFullName: `${application.firstName} ${application.lastName}`,
                    firstName: application.firstName,
                    lastName: application.lastName,
                    preferredName: application.preferredName,

                    workAuthorization: {
                        title: visaStatus.visaTitle,
                        startDate: visaStatus.startDate,
                        endDate: visaStatus.endDate,
                        daysRemaining: getDaysRemaining(visaStatus.endDate),
                    },

                    currentStep: visaStatus.currentStep,
                    nextStep: getVisaNextStep(visaStatus),
                    actionType: getVisaActionType(visaStatus),
                    currentDocument,
                };
            });

        res.status(200).json({
            count: inProgress.length,
            visaStatuses: inProgress,
        });
    } catch (error) {
        next(error);
    }
};

// Get all OPT employees in visa status management
export const getAllVisaStatuses = async (req, res, next) => {
    try {
        const { search } = req.query;

        const visaStatuses = await VisaStatus.find()
            .populate("user", "username email")
            .populate("optReceipt")
            .populate("optEad")
            .populate("i983")
            .populate("i20")
            .sort({ updatedAt: -1 });

        const userIds = visaStatuses.map((visaStatus) => visaStatus.user._id);

        const applicationFilter = {
            user: { $in: userIds },
            status: "approved",
        };

        if (search) {
            applicationFilter.$or = [
                { firstName: { $regex: search, $options: "i" } },
                { lastName: { $regex: search, $options: "i" } },
                { preferredName: { $regex: search, $options: "i" } },
            ];
        }

        const applications = await OnboardingApplication.find(applicationFilter);

        const applicationMap = new Map();

        applications.forEach((application) => {
            applicationMap.set(application.user.toString(), application);
        });

        const allVisaStatuses = visaStatuses
            .filter((visaStatus) =>
                applicationMap.has(visaStatus.user._id.toString())
            )
            .map((visaStatus) => {
                const application = applicationMap.get(
                    visaStatus.user._id.toString()
                );

                return {
                    visaStatusId: visaStatus._id,
                    employeeId: visaStatus.user._id,
                    username: visaStatus.user.username,
                    email: visaStatus.user.email,

                    legalFullName: `${application.firstName} ${application.lastName}`,
                    firstName: application.firstName,
                    lastName: application.lastName,
                    preferredName: application.preferredName,

                    workAuthorization: {
                        title: visaStatus.visaTitle,
                        startDate: visaStatus.startDate,
                        endDate: visaStatus.endDate,
                        daysRemaining: getDaysRemaining(visaStatus.endDate),
                    },

                    currentStep: visaStatus.currentStep,
                    nextStep: getVisaNextStep(visaStatus),

                    approvedDocuments: getApprovedVisaDocuments(visaStatus),
                };
            });

        res.status(200).json({
            count: allVisaStatuses.length,
            visaStatuses: allVisaStatuses,
        });
    } catch (error) {
        next(error);
    }
};

// Helper: find the visa status record that contains this document
const findVisaStatusByDocument = async (document) => {
    const visaStatus = await VisaStatus.findOne({
        $or: [
            { optReceipt: document._id },
            { optEad: document._id },
            { i983: document._id },
            { i20: document._id },
        ],
    });

    return visaStatus;
};

// HR approves one visa document and moves the employee to the next step
export const approveVisaDocument = async (req, res, next) => {
    try {
        const { documentId } = req.params;

        const document = await Document.findById(documentId);

        if (!document) {
            throw new NotFoundError("Document not found");
        }

        const allowedVisaDocuments = ["opt_receipt", "opt_ead", "i_983", "i_20"];

        if (!allowedVisaDocuments.includes(document.documentType)) {
            throw new ValidationError("This document is not a visa document");
        }

        const visaStatus = await findVisaStatusByDocument(document);

        if (!visaStatus) {
            throw new NotFoundError("Visa status record not found");
        }

        document.status = "approved";
        document.feedback = "";
        await document.save();

        if (document.documentType === "opt_receipt") {
            visaStatus.currentStep = "opt_ead";
        } else if (document.documentType === "opt_ead") {
            visaStatus.currentStep = "i_983";
        } else if (document.documentType === "i_983") {
            visaStatus.currentStep = "i_20";
        } else if (document.documentType === "i_20") {
            visaStatus.currentStep = "completed";
        }

        const updatedVisaStatus = await visaStatus.save();

        res.status(200).json({
            message: "Visa document approved successfully",
            document,
            visaStatus: updatedVisaStatus,
        });
    } catch (error) {
        next(error);
    }
};

// HR rejects one visa document and saves feedback for the employee
export const rejectVisaDocument = async (req, res, next) => {
    try {
        const { documentId } = req.params;
        const { feedback } = req.body;

        if (!feedback) {
            throw new ValidationError("Feedback is required when rejecting a visa document");
        }

        const document = await Document.findById(documentId);

        if (!document) {
            throw new NotFoundError("Document not found");
        }

        const allowedVisaDocuments = ["opt_receipt", "opt_ead", "i_983", "i_20"];

        if (!allowedVisaDocuments.includes(document.documentType)) {
            throw new ValidationError("This document is not a visa document");
        }

        const visaStatus = await findVisaStatusByDocument(document);

        if (!visaStatus) {
            throw new NotFoundError("Visa status record not found");
        }

        document.status = "rejected";
        document.feedback = feedback;
        await document.save();

        if (document.documentType === "opt_receipt") {
            visaStatus.currentStep = "opt_receipt";
        } else if (document.documentType === "opt_ead") {
            visaStatus.currentStep = "opt_ead";
        } else if (document.documentType === "i_983") {
            visaStatus.currentStep = "i_983";
        } else if (document.documentType === "i_20") {
            visaStatus.currentStep = "i_20";
        }

        const updatedVisaStatus = await visaStatus.save();

        res.status(200).json({
            message: "Visa document rejected successfully",
            document,
            visaStatus: updatedVisaStatus,
        });
    } catch (error) {
        next(error);
    }
};


// HR sends a reminder email to an OPT employee for their next visa step
export const sendVisaNotification = async (req, res, next) => {
    try {
        const { employeeId } = req.params;

        const visaStatus = await VisaStatus.findOne({
            user: employeeId,
        })
            .populate("user", "username email")
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

        const currentDocument = getCurrentVisaDocument(visaStatus);
        const currentDocumentName = getVisaDocumentName(visaStatus.currentStep);

        let subject = "";
        let message = "";

        if (!currentDocument) {
            subject = `Action Required: Please upload your ${currentDocumentName}`;
            message = `Your previous visa document has been approved. Please log in to the employee portal and upload your ${currentDocumentName}.`;
        }
        else if (currentDocument.status === "rejected") {
            subject = `Action Required: Please re-upload your ${currentDocumentName}`;
            message = `Your ${currentDocumentName} was rejected by HR.

Feedback from HR:
${currentDocument.feedback || "No feedback provided."}

Please log in to the employee portal, review the feedback, and upload a new copy of your ${currentDocumentName}.`;
        }
        else if (currentDocument.status === "pending") {
            throw new ValidationError(
                `${currentDocumentName} is waiting for HR review. Notification is not needed now.`
            );
        }
        else if (currentDocument.status === "approved") {
            subject = `Action Required: Please continue your visa process`;
            message = `Your ${currentDocumentName} has been approved. Please log in to the employee portal and continue your next visa step.`;
        }

        await sendEmail({
            to: visaStatus.user.email,
            subject,
            text: message
        });

        res.status(200).json({
            message: "Visa notification sent successfully",
            email: visaStatus.user.email,
            subject,
        });
    } catch (error) {
        next(error);
    }
};