import express from "express";

import { protect } from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";

import {
    generateRegistrationToken,
    getRegistrationTokenHistory,
    getPendingApplications,
    getRejectedApplications,
    getApprovedApplications,
    getApplicationById,
    approveApplication,
    rejectApplication,
    getEmployees,
    getEmployeeById,
    getVisaInProgress,
    getAllVisaStatuses,
    approveVisaDocument,
    rejectVisaDocument,
    sendVisaNotification,
} from "../controllers/hrController.js";

const router = express.Router();

// HR registration token management
router.post(
    "/registration-token",
    protect,
    authorizeRoles("hr"),
    generateRegistrationToken
);

router.get(
    "/registration-tokens",
    protect,
    authorizeRoles("hr"),
    getRegistrationTokenHistory
);

// HR onboarding application review
router.get(
    "/onboarding/pending",
    protect,
    authorizeRoles("hr"),
    getPendingApplications
);

router.get(
    "/onboarding/rejected",
    protect,
    authorizeRoles("hr"),
    getRejectedApplications
);

router.get(
    "/onboarding/approved",
    protect,
    authorizeRoles("hr"),
    getApprovedApplications
);

router.get(
    "/onboarding/:id",
    protect,
    authorizeRoles("hr"),
    getApplicationById
);

router.put(
    "/onboarding/:id/approve",
    protect,
    authorizeRoles("hr"),
    approveApplication
);

router.put(
    "/onboarding/:id/reject",
    protect,
    authorizeRoles("hr"),
    rejectApplication
);

// HR employee profiles
router.get(
    "/employees",
    protect,
    authorizeRoles("hr"),
    getEmployees
);

router.get(
    "/employees/:employeeId",
    protect,
    authorizeRoles("hr"),
    getEmployeeById
);

// HR visa status management
router.get(
    "/visa/in-progress",
    protect,
    authorizeRoles("hr"),
    getVisaInProgress
);

router.get(
    "/visa/all",
    protect,
    authorizeRoles("hr"),
    getAllVisaStatuses
);

router.put(
    "/visa/:documentId/approve",
    protect,
    authorizeRoles("hr"),
    approveVisaDocument
);

router.put(
    "/visa/:documentId/reject",
    protect,
    authorizeRoles("hr"),
    rejectVisaDocument
);

router.post(
    "/visa/:employeeId/notify",
    protect,
    authorizeRoles("hr"),
    sendVisaNotification
);

export default router;