import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Layout from "../../components/common/Layout";
import Loading from "../../components/common/Loading";
import Message from "../../components/common/Message";
import SearchBar from "../../components/common/SearchBar";
import ConfirmModal from "../../components/common/ConfirmModal";
import FeedbackModal from "../../components/common/FeedbackModal";

import VisaStatusTabs from "../../components/hr/VisaStatusTabs";
import VisaInProgressTable from "../../components/hr/VisaInProgressTable";
import VisaAllTable from "../../components/hr/VisaAllTable";

import {
  approveVisaDocument,
  clearHrError,
  clearHrSuccessMessage,
  fetchAllVisaStatuses,
  fetchVisaInProgress,
  rejectVisaDocument,
  sendVisaNotification,
} from "../../features/hr/hrSlice";

/*
  VisaStatusManagementPage

  HR uses this page to manage OPT/F1 visa document workflow.

  It has two tabs:
  1. In Progress
     - shows visa records that are not finished
     - HR can approve/reject uploaded documents
     - HR can send notification if waiting for employee upload

  2. All
     - shows all visa records
     - supports search by employee name
     - shows approved documents with preview/download actions

  Responsive:
  - Tabs are responsive through Bootstrap Nav.
  - SearchBar follows parent width.
  - Tables are responsive through DataTable.
  - Modals are responsive through Bootstrap Modal.
*/
export default function VisaStatusManagementPage() {
  const dispatch = useDispatch();

  const [activeTab, setActiveTab] = useState("inProgress");
  const [search, setSearch] = useState("");

  const [approveDocumentId, setApproveDocumentId] = useState(null);
  const [rejectDocumentId, setRejectDocumentId] = useState(null);
  const [notificationVisaStatus, setNotificationVisaStatus] = useState(null);

  const {
    visaInProgress,
    allVisaStatuses,
    loading,
    error,
    successMessage,
  } = useSelector((state) => state.hr);

  /*
    Load data based on active tab.

    In Progress:
    - fetch records still in visa process

    All:
    - fetch all visa records
    - pass search keyword to backend
  */
  useEffect(() => {
    if (activeTab === "inProgress") {
      dispatch(fetchVisaInProgress());
    }

    if (activeTab === "all") {
      dispatch(fetchAllVisaStatuses(search));
    }

    return () => {
      dispatch(clearHrError());
      dispatch(clearHrSuccessMessage());
    };
  }, [activeTab, search, dispatch]);

  /*
    Approve selected visa document.
  */
  const handleApproveDocument = async () => {
    if (!approveDocumentId) {
      return;
    }

    try {
      await dispatch(approveVisaDocument(approveDocumentId)).unwrap();
      setApproveDocumentId(null);

      dispatch(fetchVisaInProgress());
      dispatch(fetchAllVisaStatuses(search));
    } catch (error) {
      console.error("Failed to approve visa document:", error);
    }
  };

  /*
    Reject selected visa document with HR feedback.
  */
  const handleRejectDocument = async (feedback) => {
    if (!rejectDocumentId) {
      return;
    }

    try {
      await dispatch(
        rejectVisaDocument({
          documentId: rejectDocumentId,
          feedback,
        })
      ).unwrap();

      setRejectDocumentId(null);

      dispatch(fetchVisaInProgress());
      dispatch(fetchAllVisaStatuses(search));
    } catch (error) {
      console.error("Failed to reject visa document:", error);
    }
  };

  /*
    Send notification email to employee.

    We try different possible employee id fields because backend response
    may store employee/user id differently.
  */
  const handleSendNotification = async () => {
    if (!notificationVisaStatus) {
      return;
    }

    const employeeId =
      notificationVisaStatus.employee?._id ||
      notificationVisaStatus.employee ||
      notificationVisaStatus.user?._id ||
      notificationVisaStatus.user ||
      notificationVisaStatus.employeeId ||
      notificationVisaStatus.userId;

    if (!employeeId) {
      console.error("Cannot find employee id for visa notification");
      return;
    }

    try {
      await dispatch(sendVisaNotification(employeeId)).unwrap();
      setNotificationVisaStatus(null);

      dispatch(fetchVisaInProgress());
      dispatch(fetchAllVisaStatuses(search));
    } catch (error) {
      console.error("Failed to send visa notification:", error);
    }
  };

  const getAllResultMessage = () => {
    if (activeTab !== "all" || loading) {
      return "";
    }

    if (!search.trim()) {
      return `Total Visa Records: ${allVisaStatuses.length}`;
    }

    if (allVisaStatuses.length === 0) {
      return "No records found.";
    }

    if (allVisaStatuses.length === 1) {
      return "1 record found.";
    }

    return `${allVisaStatuses.length} records found.`;
  };

  return (
    <Layout>
      <div className="mb-4">
        <h1
          className="mb-1"
          style={{
            color: "#1f2937",
            fontSize: "clamp(30px, 4vw, 42px)",
            fontWeight: "900",
            letterSpacing: "-0.055em",
            lineHeight: "1.08",
          }}
        >
          Visa Status Management
        </h1>

        <p
          className="mb-0"
          style={{
            color: "#6b7280",
            fontSize: "15px",
            fontWeight: "600",
            lineHeight: "1.6",
          }}
        >
          Review OPT/F1 visa document progress, approve uploaded documents, and send reminders.
        </p>
      </div>

      {error && <Message variant="danger">{error}</Message>}
      {successMessage && <Message variant="success">{successMessage}</Message>}

      <VisaStatusTabs activeTab={activeTab} onChange={setActiveTab} />

      {activeTab === "all" && (
        <div
          className="mb-3"
          style={{
            background: "#ffffff",
            border: "1px solid #e5e7eb",
            borderRadius: "20px",
            padding: "18px",
            boxShadow: "0 10px 24px rgba(15, 23, 42, 0.05)",
            fontFamily:
              "Arial, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
          }}
        >
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search by first name, last name, or preferred name..."
          />

          {getAllResultMessage() && (
            <div
              className="d-inline-flex align-items-center"
              style={{
                padding: "7px 12px",
                borderRadius: "999px",
                background: "#eef2ff",
                color: "#4f46e5",
                fontSize: "12px",
                fontWeight: "800",
              }}
            >
              {getAllResultMessage()}
            </div>
          )}
        </div>
      )}

      {loading ? (
        <Loading text="Loading visa statuses..." />
      ) : (
        <>
          {activeTab === "inProgress" && (
            <VisaInProgressTable
              visaStatuses={visaInProgress}
              onApproveDocument={(documentId) =>
                setApproveDocumentId(documentId)
              }
              onRejectDocument={(documentId) =>
                setRejectDocumentId(documentId)
              }
              onSendNotification={(visaStatus) =>
                setNotificationVisaStatus(visaStatus)
              }
            />
          )}

          {activeTab === "all" && (
            <VisaAllTable visaStatuses={allVisaStatuses} />
          )}
        </>
      )}

      <ConfirmModal
        show={!!approveDocumentId}
        title="Approve Visa Document"
        message="Are you sure you want to approve this visa document?"
        confirmText="Approve"
        cancelText="Cancel"
        loading={loading}
        onClose={() => setApproveDocumentId(null)}
        onConfirm={handleApproveDocument}
      />

      <FeedbackModal
        show={!!rejectDocumentId}
        title="Reject Visa Document"
        label="Feedback"
        placeholder="Enter feedback for the employee..."
        confirmText="Reject"
        cancelText="Cancel"
        loading={loading}
        onClose={() => setRejectDocumentId(null)}
        onConfirm={handleRejectDocument}
      />

      <ConfirmModal
        show={!!notificationVisaStatus}
        title="Send Notification"
        message="Are you sure you want to send a visa document reminder email to this employee?"
        confirmText="Send"
        cancelText="Cancel"
        loading={loading}
        onClose={() => setNotificationVisaStatus(null)}
        onConfirm={handleSendNotification}
      />
    </Layout>
  );
}