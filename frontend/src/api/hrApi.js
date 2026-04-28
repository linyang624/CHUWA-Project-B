import { apiRequest } from "./apiClient";

/*
  HR API file

  This file wraps all backend HR routes.
  Components and Redux should call these functions instead of writing fetch URLs directly.
*/

// ==============================
// Registration Token APIs
// ==============================

/*
  Generate a registration token and send email to a new employee.

  Backend:
  POST /api/hr/registration-token

  Expected payload:
  {
    email: "employee@example.com",
    firstName: "Alice",
    lastName: "Zhang"
  }
*/
export const generateRegistrationTokenApi = (tokenData) => {
  return apiRequest("/hr/registration-token", {
    method: "POST",
    body: JSON.stringify(tokenData),
  });
};

/*
  Get all registration token history records.

  Backend:
  GET /api/hr/registration-tokens

  Backend returns:
  {
    count,
    tokens
  }
*/
export const getRegistrationTokenHistoryApi = () => {
  return apiRequest("/hr/registration-tokens");
};

// ==============================
// Onboarding Application APIs
// ==============================

/*
  Get all pending onboarding applications.

  Backend:
  GET /api/hr/onboarding/pending
*/
export const getPendingApplicationsApi = () => {
  return apiRequest("/hr/onboarding/pending");
};

/*
  Get all rejected onboarding applications.

  Backend:
  GET /api/hr/onboarding/rejected
*/
export const getRejectedApplicationsApi = () => {
  return apiRequest("/hr/onboarding/rejected");
};

/*
  Get all approved onboarding applications.

  Backend:
  GET /api/hr/onboarding/approved
*/
export const getApprovedApplicationsApi = () => {
  return apiRequest("/hr/onboarding/approved");
};

/*
  Get one onboarding application by application id.

  Backend:
  GET /api/hr/onboarding/:id
*/
export const getApplicationByIdApi = (applicationId) => {
  return apiRequest(`/hr/onboarding/${applicationId}`);
};

/*
  Approve one onboarding application.

  Backend:
  PUT /api/hr/onboarding/:id/approve
*/
export const approveApplicationApi = (applicationId) => {
  return apiRequest(`/hr/onboarding/${applicationId}/approve`, {
    method: "PUT",
  });
};

/*
  Reject one onboarding application with HR feedback.

  Backend:
  PUT /api/hr/onboarding/:id/reject

  Expected payload:
  {
    feedback: "Please re-upload your document."
  }
*/
export const rejectApplicationApi = (applicationId, feedback) => {
  return apiRequest(`/hr/onboarding/${applicationId}/reject`, {
    method: "PUT",
    body: JSON.stringify({ feedback }),
  });
};

// ==============================
// Employee Profile APIs
// ==============================

/*
  Get approved employee profile summaries.

  Backend:
  GET /api/hr/employees

  Optional search:
  GET /api/hr/employees?search=alice

  Backend searches firstName, lastName, preferredName.
*/
export const getEmployeesApi = (search = "") => {
  const query = search ? `?search=${encodeURIComponent(search)}` : "";

  return apiRequest(`/hr/employees${query}`);
};

/*
  Get one employee's full profile by employee user id.

  Backend:
  GET /api/hr/employees/:employeeId
*/
export const getEmployeeByIdApi = (employeeId) => {
  return apiRequest(`/hr/employees/${employeeId}`);
};

// ==============================
// Visa Status APIs
// ==============================

/*
  Get all OPT employees whose visa process is not completed.

  Backend:
  GET /api/hr/visa/in-progress
*/
export const getVisaInProgressApi = () => {
  return apiRequest("/hr/visa/in-progress");
};

/*
  Get all OPT employee visa statuses.

  Backend:
  GET /api/hr/visa/all

  Optional search:
  GET /api/hr/visa/all?search=alice
*/
export const getAllVisaStatusesApi = (search = "") => {
  const query = search ? `?search=${encodeURIComponent(search)}` : "";

  return apiRequest(`/hr/visa/all${query}`);
};

/*
  Approve one visa document.

  Backend:
  PUT /api/hr/visa/:documentId/approve
*/
export const approveVisaDocumentApi = (documentId) => {
  return apiRequest(`/hr/visa/${documentId}/approve`, {
    method: "PUT",
  });
};

/*
  Reject one visa document with feedback.

  Backend:
  PUT /api/hr/visa/:documentId/reject

  Expected payload:
  {
    feedback: "Please upload a clearer copy."
  }
*/
export const rejectVisaDocumentApi = (documentId, feedback) => {
  return apiRequest(`/hr/visa/${documentId}/reject`, {
    method: "PUT",
    body: JSON.stringify({ feedback }),
  });
};

/*
  Send visa notification email to employee.

  Backend:
  POST /api/hr/visa/:employeeId/notify
*/
export const sendVisaNotificationApi = (employeeId) => {
  return apiRequest(`/hr/visa/${employeeId}/notify`, {
    method: "POST",
  });
};

// ==============================
// Dashboard helper API
// ==============================

/*
  Get dashboard summary counts for HR home page.

  This does not need a new backend route.
  It reuses three existing backend APIs:

  1. GET /api/hr/onboarding/pending
  2. GET /api/hr/employees
  3. GET /api/hr/visa/in-progress
*/
export const getHrDashboardStatsApi = async () => {
  const [pendingData, employeeData, visaData] = await Promise.all([
    getPendingApplicationsApi(),
    getEmployeesApi(),
    getVisaInProgressApi(),
  ]);

  return {
    pendingApplications: pendingData.count || 0,
    approvedEmployees: employeeData.count || 0,
    visaInProgress: visaData.count || 0,
  };
};