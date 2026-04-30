import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import Layout from "../../components/common/Layout";
import Loading from "../../components/common/Loading";
import Message from "../../components/common/Message";
import ApplicationStatusTabs from "../../components/hr/ApplicationStatusTabs";
import ApplicationTable from "../../components/hr/ApplicationTable";

import {
  clearHrError,
  fetchApprovedApplications,
  fetchPendingApplications,
  fetchRejectedApplications,
} from "../../features/hr/hrSlice";

/*
  OnboardingReviewPage

  HR can review onboarding applications by status:
  - Pending
  - Approved
  - Rejected

  Pending applications can be opened and reviewed in detail.
  Approved and rejected applications can also be viewed, but cannot be changed.

  Responsive:
  - Header area stacks on small screens.
  - Tabs are Bootstrap responsive.
  - Table is responsive through DataTable.
*/
export default function OnboardingReviewPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [activeStatus, setActiveStatus] = useState("pending");

  const {
    pendingApplications,
    approvedApplications,
    rejectedApplications,
    loading,
    error,
  } = useSelector((state) => state.hr);

  /*
    Load applications based on active tab.
  */
  useEffect(() => {
    if (activeStatus === "pending") {
      dispatch(fetchPendingApplications());
    }

    if (activeStatus === "approved") {
      dispatch(fetchApprovedApplications());
    }

    if (activeStatus === "rejected") {
      dispatch(fetchRejectedApplications());
    }

    return () => {
      dispatch(clearHrError());
    };
  }, [activeStatus, dispatch]);

  const getCurrentApplications = () => {
    if (activeStatus === "approved") {
      return approvedApplications;
    }

    if (activeStatus === "rejected") {
      return rejectedApplications;
    }

    return pendingApplications;
  };

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
            Onboarding Application Review
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
            Review pending, approved, and rejected onboarding applications.
          </p>
        </div>

        <Button
          variant="outline-secondary"
          onClick={() => navigate("/hr/hiring-management")}
          className="fw-bold text-nowrap px-3"
          style={{
            fontSize: "13px",
          }}
        >
          Back to Hiring Management
        </Button>
      </div>

      {error && <Message variant="danger">{error}</Message>}

      <ApplicationStatusTabs
        activeStatus={activeStatus}
        onChange={setActiveStatus}
      />

      {loading ? (
        <Loading text="Loading applications..." />
      ) : (
        <ApplicationTable applications={getCurrentApplications()} />
      )}
    </Layout>
  );
}