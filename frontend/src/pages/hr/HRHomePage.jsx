import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Col, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import Layout from "../../components/common/Layout";
import Loading from "../../components/common/Loading";
import Message from "../../components/common/Message";
import DashboardCard from "../../components/hr/DashboardCard";

import {
  clearHrError,
  fetchHrDashboardStats,
} from "../../features/hr/hrSlice";

/*
  HRHomePage

  This is the HR dashboard page after HR logs in.

  It shows three summary cards:
  1. Pending onboarding applications
  2. Approved employees
  3. Visa status records in progress

  Responsive:
  - On small screens, cards stack vertically.
  - On medium and larger screens, cards show in one row.
*/
export default function HRHomePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { dashboardStats, loading, error } = useSelector((state) => state.hr);

  /*
    Load dashboard stats when HR enters this page.
  */
  useEffect(() => {
    dispatch(fetchHrDashboardStats());

    return () => {
      dispatch(clearHrError());
    };
  }, [dispatch]);

  return (
    <Layout>
      <h1 className="mb-4">HR Dashboard</h1>

      {error && <Message variant="danger">{error}</Message>}

      {loading ? (
        <Loading text="Loading dashboard..." />
      ) : (
        <Row className="g-3">
          <Col xs={12} md={4}>
            <DashboardCard
              title="Hiring Management"
              value={dashboardStats.pendingApplications}
              description="Pending onboarding applications waiting for HR review."
              onClick={() => navigate("/hr/hiring-management/onboarding-review")}
            />
          </Col>

          <Col xs={12} md={4}>
            <DashboardCard
              title="Employee Profiles"
              value={dashboardStats.approvedEmployees}
              description="Approved employees currently available in employee profiles."
              onClick={() => navigate("/hr/employee-profiles")}
            />
          </Col>

          <Col xs={12} md={4}>
            <DashboardCard
              title="Visa Status Management"
              value={dashboardStats.visaInProgress}
              description="OPT employees whose visa document flow is still in progress."
              onClick={() => navigate("/hr/visa-status-management")}
            />
          </Col>
        </Row>
      )}
    </Layout>
  );
}