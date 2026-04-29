import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import {
  getHrDashboardStatsApi,
  generateRegistrationTokenApi,
  getRegistrationTokenHistoryApi,
  getPendingApplicationsApi,
  getRejectedApplicationsApi,
  getApprovedApplicationsApi,
  getApplicationByIdApi,
  approveApplicationApi,
  rejectApplicationApi,
  getEmployeesApi,
  getEmployeeByIdApi,
  getVisaInProgressApi,
  getAllVisaStatusesApi,
  approveVisaDocumentApi,
  rejectVisaDocumentApi,
  sendVisaNotificationApi,
} from "../../api/hrApi";

/*
  HR Redux slice

  This file stores all HR-side frontend data:
  - dashboard counts
  - employee profiles
  - hiring management data
  - onboarding applications
  - visa status data
*/

// ==============================
// Dashboard
// ==============================

/*
  Fetch HR homepage dashboard stats.

  It gets:
  - number of pending applications
  - number of approved employees
  - number of visa statuses in progress
*/
export const fetchHrDashboardStats = createAsyncThunk(
  "hr/fetchHrDashboardStats",
  async (_, { rejectWithValue }) => {
    try {
      return await getHrDashboardStatsApi();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// ==============================
// Registration Token
// ==============================

/*
  Generate registration token and send registration email.
*/
export const generateRegistrationToken = createAsyncThunk(
  "hr/generateRegistrationToken",
  async (tokenData, { rejectWithValue }) => {
    try {
      return await generateRegistrationTokenApi(tokenData);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

/*
  Fetch registration token history.
*/
export const fetchRegistrationTokenHistory = createAsyncThunk(
  "hr/fetchRegistrationTokenHistory",
  async (_, { rejectWithValue }) => {
    try {
      return await getRegistrationTokenHistoryApi();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// ==============================
// Onboarding Applications
// ==============================

/*
  Fetch pending onboarding applications.
*/
export const fetchPendingApplications = createAsyncThunk(
  "hr/fetchPendingApplications",
  async (_, { rejectWithValue }) => {
    try {
      return await getPendingApplicationsApi();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

/*
  Fetch rejected onboarding applications.
*/
export const fetchRejectedApplications = createAsyncThunk(
  "hr/fetchRejectedApplications",
  async (_, { rejectWithValue }) => {
    try {
      return await getRejectedApplicationsApi();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

/*
  Fetch approved onboarding applications.
*/
export const fetchApprovedApplications = createAsyncThunk(
  "hr/fetchApprovedApplications",
  async (_, { rejectWithValue }) => {
    try {
      return await getApprovedApplicationsApi();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

/*
  Fetch one onboarding application detail by application id.
*/
export const fetchApplicationById = createAsyncThunk(
  "hr/fetchApplicationById",
  async (applicationId, { rejectWithValue }) => {
    try {
      return await getApplicationByIdApi(applicationId);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

/*
  Approve one onboarding application.
*/
export const approveApplication = createAsyncThunk(
  "hr/approveApplication",
  async (applicationId, { rejectWithValue }) => {
    try {
      return await approveApplicationApi(applicationId);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

/*
  Reject one onboarding application with HR feedback.
*/
export const rejectApplication = createAsyncThunk(
  "hr/rejectApplication",
  async ({ applicationId, feedback }, { rejectWithValue }) => {
    try {
      return await rejectApplicationApi(applicationId, feedback);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// ==============================
// Employee Profiles
// ==============================

/*
  Fetch employee profile summary list.

  search is optional.
*/
export const fetchEmployees = createAsyncThunk(
  "hr/fetchEmployees",
  async (search = "", { rejectWithValue }) => {
    try {
      return await getEmployeesApi(search);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

/*
  Fetch one employee full profile by employee user id.
*/
export const fetchEmployeeById = createAsyncThunk(
  "hr/fetchEmployeeById",
  async (employeeId, { rejectWithValue }) => {
    try {
      return await getEmployeeByIdApi(employeeId);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// ==============================
// Visa Status Management
// ==============================

/*
  Fetch all visa statuses that are still in progress.
*/
export const fetchVisaInProgress = createAsyncThunk(
  "hr/fetchVisaInProgress",
  async (_, { rejectWithValue }) => {
    try {
      return await getVisaInProgressApi();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

/*
  Fetch all visa statuses.

  search is optional.
*/
export const fetchAllVisaStatuses = createAsyncThunk(
  "hr/fetchAllVisaStatuses",
  async (search = "", { rejectWithValue }) => {
    try {
      return await getAllVisaStatusesApi(search);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

/*
  Approve one visa document.
*/
export const approveVisaDocument = createAsyncThunk(
  "hr/approveVisaDocument",
  async (documentId, { rejectWithValue }) => {
    try {
      return await approveVisaDocumentApi(documentId);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

/*
  Reject one visa document with HR feedback.
*/
export const rejectVisaDocument = createAsyncThunk(
  "hr/rejectVisaDocument",
  async ({ documentId, feedback }, { rejectWithValue }) => {
    try {
      return await rejectVisaDocumentApi(documentId, feedback);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

/*
  Send visa notification email to employee.
*/
export const sendVisaNotification = createAsyncThunk(
  "hr/sendVisaNotification",
  async (employeeId, { rejectWithValue }) => {
    try {
      return await sendVisaNotificationApi(employeeId);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// ==============================
// Initial State
// ==============================

const initialState = {
  dashboardStats: {
    pendingApplications: 0,
    approvedEmployees: 0,
    visaInProgress: 0,
  },

  registrationTokens: [],

  pendingApplications: [],
  rejectedApplications: [],
  approvedApplications: [],
  selectedApplication: null,

  employees: [],
  selectedEmployee: null,

  visaInProgress: [],
  allVisaStatuses: [],

  loading: false,
  error: "",
  successMessage: "",
};

// ==============================
// Slice
// ==============================

const hrSlice = createSlice({
  name: "hr",
  initialState,
  reducers: {
    /*
      Clear error message from HR state.
      Useful when leaving a page or closing an alert.
    */
    clearHrError: (state) => {
      state.error = "";
    },

    /*
      Clear success message from HR state.
      Useful after showing success alert to user.
    */
    clearHrSuccessMessage: (state) => {
      state.successMessage = "";
    },

    /*
      Clear selected application detail.
      Useful when leaving ApplicationDetailPage.
    */
    clearSelectedApplication: (state) => {
      state.selectedApplication = null;
    },

    /*
      Clear selected employee detail.
      Useful when leaving EmployeeDetailPage.
    */
    clearSelectedEmployee: (state) => {
      state.selectedEmployee = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ==============================
      // Dashboard
      // ==============================
      .addCase(fetchHrDashboardStats.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(fetchHrDashboardStats.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboardStats = action.payload;
      })
      .addCase(fetchHrDashboardStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch dashboard stats";
      })

      // ==============================
      // Registration Token
      // ==============================
      .addCase(generateRegistrationToken.pending, (state) => {
        state.loading = true;
        state.error = "";
        state.successMessage = "";
      })
      .addCase(generateRegistrationToken.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage =
          action.payload.message || "Registration token generated successfully";

        // if (action.payload.registrationToken) {
        //   state.registrationTokens.unshift(action.payload.registrationToken);
        // }
      })
      .addCase(generateRegistrationToken.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to generate registration token";
      })

      .addCase(fetchRegistrationTokenHistory.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(fetchRegistrationTokenHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.registrationTokens = action.payload.tokens || [];
      })
      .addCase(fetchRegistrationTokenHistory.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || "Failed to fetch registration token history";
      })

      // ==============================
      // Pending Applications
      // ==============================
      .addCase(fetchPendingApplications.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(fetchPendingApplications.fulfilled, (state, action) => {
        state.loading = false;
        state.pendingApplications = action.payload.applications || [];
      })
      .addCase(fetchPendingApplications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch pending applications";
      })

      // ==============================
      // Rejected Applications
      // ==============================
      .addCase(fetchRejectedApplications.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(fetchRejectedApplications.fulfilled, (state, action) => {
        state.loading = false;
        state.rejectedApplications = action.payload.applications || [];
      })
      .addCase(fetchRejectedApplications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch rejected applications";
      })

      // ==============================
      // Approved Applications
      // ==============================
      .addCase(fetchApprovedApplications.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(fetchApprovedApplications.fulfilled, (state, action) => {
        state.loading = false;
        state.approvedApplications = action.payload.applications || [];
      })
      .addCase(fetchApprovedApplications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch approved applications";
      })

      // ==============================
      // Application Detail
      // ==============================
      .addCase(fetchApplicationById.pending, (state) => {
        state.loading = true;
        state.error = "";
        state.selectedApplication = null;
      })
      .addCase(fetchApplicationById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedApplication = action.payload.application || null;
      })
      .addCase(fetchApplicationById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch application detail";
      })

      // ==============================
      // Approve Application
      // ==============================
      .addCase(approveApplication.pending, (state) => {
        state.loading = true;
        state.error = "";
        state.successMessage = "";
      })
      .addCase(approveApplication.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage =
          action.payload.message || "Application approved successfully";
        state.selectedApplication = action.payload.application || null;
      })
      .addCase(approveApplication.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to approve application";
      })

      // ==============================
      // Reject Application
      // ==============================
      .addCase(rejectApplication.pending, (state) => {
        state.loading = true;
        state.error = "";
        state.successMessage = "";
      })
      .addCase(rejectApplication.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage =
          action.payload.message || "Application rejected successfully";
        state.selectedApplication = action.payload.application || null;
      })
      .addCase(rejectApplication.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to reject application";
      })

      // ==============================
      // Employees
      // ==============================
      .addCase(fetchEmployees.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.loading = false;
        state.employees = action.payload.employees || [];
      })
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch employees";
      })

      // ==============================
      // Employee Detail
      // ==============================
      .addCase(fetchEmployeeById.pending, (state) => {
        state.loading = true;
        state.error = "";
        state.selectedEmployee = null;
      })
      .addCase(fetchEmployeeById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedEmployee = action.payload.employee || null;
      })
      .addCase(fetchEmployeeById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch employee detail";
      })

      // ==============================
      // Visa In Progress
      // ==============================
      .addCase(fetchVisaInProgress.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(fetchVisaInProgress.fulfilled, (state, action) => {
        state.loading = false;
        state.visaInProgress = action.payload.visaStatuses || [];
      })
      .addCase(fetchVisaInProgress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch visa in progress";
      })

      // ==============================
      // All Visa Statuses
      // ==============================
      .addCase(fetchAllVisaStatuses.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(fetchAllVisaStatuses.fulfilled, (state, action) => {
        state.loading = false;
        state.allVisaStatuses = action.payload.visaStatuses || [];
      })
      .addCase(fetchAllVisaStatuses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch all visa statuses";
      })

      // ==============================
      // Approve Visa Document
      // ==============================
      .addCase(approveVisaDocument.pending, (state) => {
        state.loading = true;
        state.error = "";
        state.successMessage = "";
      })
      .addCase(approveVisaDocument.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage =
          action.payload.message || "Visa document approved successfully";
      })
      .addCase(approveVisaDocument.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to approve visa document";
      })

      // ==============================
      // Reject Visa Document
      // ==============================
      .addCase(rejectVisaDocument.pending, (state) => {
        state.loading = true;
        state.error = "";
        state.successMessage = "";
      })
      .addCase(rejectVisaDocument.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage =
          action.payload.message || "Visa document rejected successfully";
      })
      .addCase(rejectVisaDocument.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to reject visa document";
      })

      // ==============================
      // Send Visa Notification
      // ==============================
      .addCase(sendVisaNotification.pending, (state) => {
        state.loading = true;
        state.error = "";
        state.successMessage = "";
      })
      .addCase(sendVisaNotification.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage =
          action.payload.message || "Visa notification sent successfully";
      })
      .addCase(sendVisaNotification.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to send visa notification";
      });
  },
});

export const {
  clearHrError,
  clearHrSuccessMessage,
  clearSelectedApplication,
  clearSelectedEmployee,
} = hrSlice.actions;

export default hrSlice.reducer;