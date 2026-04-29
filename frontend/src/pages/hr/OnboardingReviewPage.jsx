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
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-2 mb-4">
        <h1 className="mb-0">Onboarding Application Review</h1>

        <Button
          variant="outline-secondary"
          onClick={() => navigate("/hr/hiring-management")}
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