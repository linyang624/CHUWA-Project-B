import express from "express";

import { protect } from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";

import {
    getPendingApplications,
    getRejectedApplications,
    getApprovedApplications,
    getApplicationById,
    approveApplication,
    rejectApplication,
    getEmployees,
    getEmployeeById,
} from "../controllers/hrController.js";

const router = express.Router();

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

export default router;