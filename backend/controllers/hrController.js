import OnboardingApplication from "../models/OnboardingApplication.js";
import VisaStatus from "../models/VisaStatus.js";
import { NotFoundError, ValidationError } from "../utils/error.js";

export const generateRegistrationToken = async (req, res, next) => {
    res.json({ message: "Generate registration token" });
};

export const getRegistrationTokenHistory = async (req, res, next) => {
    res.json({ message: "Get registration token history" });
};

//HELPER: Get onboarding applications by status
const getApplicationsByStatus = async (status, res, next) => {
    try {
        const applications = await OnboardingApplication.find({ status })
            .populate("user", "username email role")
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
            .populate("user", "username email role")
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
            await VisaStatus.findOneAndUpdate(
                { user: application.user },
                {
                    user: application.user,
                    visaTitle: "f1_cpt_opt",
                    startDate: application.workAuthorization.startDate,
                    endDate: application.workAuthorization.endDate,
                    currentStep: "opt_receipt",
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
    } 
    catch (error) {
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

export const getEmployees = async (req, res, next) => {
    res.json({ message: "Get employees" });
};

export const getEmployeeById = async (req, res, next) => {
    res.json({ message: "Get employee by id" });
};

export const getVisaInProgress = async (req, res, next) => {
    res.json({ message: "Get visa in progress" });
};

export const getAllVisaStatuses = async (req, res, next) => {
    res.json({ message: "Get all visa statuses" });
};

export const approveVisaDocument = async (req, res, next) => {
    res.json({ message: "Approve visa document" });
};

export const rejectVisaDocument = async (req, res, next) => {
    res.json({ message: "Reject visa document" });
};

export const sendVisaNotification = async (req, res, next) => {
    res.json({ message: "Send visa notification" });
};