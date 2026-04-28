import crypto from "crypto";

import OnboardingApplication from "../models/OnboardingApplication.js";
import VisaStatus from "../models/VisaStatus.js";
import RegistrationToken from "../models/RegistrationToken.js";
import Document from "../models/Document.js";
import { NotFoundError, ValidationError } from "../utils/error.js";


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

        res.status(201).json({
            message: "Registration token generated successfully",
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