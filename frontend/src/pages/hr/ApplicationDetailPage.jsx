import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";

import Layout from "../../components/common/Layout";
import Loading from "../../components/common/Loading";
import Message from "../../components/common/Message";
import ConfirmModal from "../../components/common/ConfirmModal";
import FeedbackModal from "../../components/common/FeedbackModal";
import ApplicationDetailSection from "../../components/hr/ApplicationDetailSection";

import {
  approveApplication,
  clearHrError,
  clearHrSuccessMessage,
  clearSelectedApplication,
  fetchApplicationById,
  rejectApplication,
} from "../../features/hr/hrSlice";

/*
  ApplicationDetailPage

  HR uses this page to review one onboarding application.

  It supports:
  - view full application detail
  - approve pending application
  - reject pending application with feedback

  Business rule:
  - Pending application: HR can approve or reject
  - Approved / Rejected application: HR can only view detail

  Responsive:
  - Header action area stacks on small screens.
  - Application detail content is responsive inside ApplicationDetailSection.
*/
export default function ApplicationDetailPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { applicationId } = useParams();

  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);

  const { selectedApplication, loading, error, successMessage } = useSelector(
    (state) => state.hr
  );

  /*
    Load application detail when this page opens.
  */
  useEffect(() => {
    if (applicationId) {
      dispatch(fetchApplicationById(applicationId));
    }

    return () => {
      dispatch(clearSelectedApplication());
      dispatch(clearHrError());
      dispatch(clearHrSuccessMessage());
    };
  }, [applicationId, dispatch]);

  /*
    Approve current application.
  */
  const handleApprove = async () => {
    try {
      await dispatch(approveApplication(applicationId)).unwrap();
      setShowApproveModal(false);

      // Refresh detail after approval.
      dispatch(fetchApplicationById(applicationId));
    } catch (error) {
      console.error("Failed to approve application:", error);
    }
  };

  /*
    Reject current application with HR feedback.
  */
  const handleReject = async (feedback) => {
    try {
      await dispatch(
        rejectApplication({
          applicationId,
          feedback,
        })
      ).unwrap();

      setShowRejectModal(false);

      // Refresh detail after rejection.
      dispatch(fetchApplicationById(applicationId));
    } catch (error) {
      console.error("Failed to reject application:", error);
    }
  };

  const isPending = selectedApplication?.status === "pending";

  return (
    <Layout>
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
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
            Application Detail
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
            Review employee onboarding information and documents.
          </p>
        </div>

        <Button
          variant="outline-secondary"
          onClick={() => navigate("/hr/hiring-management/onboarding-review")}
          style={outlineSecondaryButtonStyle}
        >
          Back to Application Review
        </Button>
      </div>

      {error && <Message variant="danger">{error}</Message>}
      {successMessage && <Message variant="success">{successMessage}</Message>}

      {loading && !selectedApplication ? (
        <Loading text="Loading application detail..." />
      ) : (
        <>
          <ApplicationDetailSection application={selectedApplication} />

          {isPending && (
            <div
              className="d-flex flex-column flex-sm-row justify-content-end gap-2 mb-4 p-3"
              style={{
                background: "#ffffff",
                border: "1px solid #e5e7eb",
                borderRadius: "20px",
                boxShadow: "0 10px 24px rgba(15, 23, 42, 0.05)",
                fontFamily:
                  "Arial, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
              }}
            >
              <Button
                variant="success"
                onClick={() => setShowApproveModal(true)}
                disabled={loading}
                style={approveButtonStyle}
              >
                Approve
              </Button>

              <Button
                variant="danger"
                onClick={() => setShowRejectModal(true)}
                disabled={loading}
                style={rejectButtonStyle}
              >
                Reject
              </Button>
            </div>
          )}
        </>
      )}

      <ConfirmModal
        show={showApproveModal}
        title="Approve Application"
        message="Are you sure you want to approve this onboarding application?"
        confirmText="Approve"
        cancelText="Cancel"
        loading={loading}
        onClose={() => setShowApproveModal(false)}
        onConfirm={handleApprove}
      />

      <FeedbackModal
        show={showRejectModal}
        title="Reject Application"
        label="Feedback"
        placeholder="Enter feedback for the employee..."
        confirmText="Reject"
        cancelText="Cancel"
        loading={loading}
        onClose={() => setShowRejectModal(false)}
        onConfirm={handleReject}
      />
    </Layout>
  );
}

const outlineSecondaryButtonStyle = {
  borderRadius: "999px",
  borderColor: "#d8dee8",
  color: "#374151",
  background: "#ffffff",
  fontSize: "13px",
  fontWeight: "800",
  padding: "8px 16px",
  boxShadow: "0 4px 12px rgba(15, 23, 42, 0.06)",
  whiteSpace: "nowrap",
};

const approveButtonStyle = {
  borderRadius: "999px",
  border: "none",
  background: "#16a34a",
  fontSize: "14px",
  fontWeight: "800",
  padding: "9px 22px",
  boxShadow: "0 8px 16px rgba(22, 163, 74, 0.18)",
};

const rejectButtonStyle = {
  borderRadius: "999px",
  border: "none",
  background: "#dc2626",
  fontSize: "14px",
  fontWeight: "800",
  padding: "9px 22px",
  boxShadow: "0 8px 16px rgba(220, 38, 38, 0.18)",
};