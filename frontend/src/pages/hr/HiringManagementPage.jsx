import { Col, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import Layout from "../../components/common/Layout";
import DashboardCard from "../../components/hr/DashboardCard";

/*
  HiringManagementPage

  This page is the entry page for HR hiring management.

  It has two main actions:
  1. Registration Token
     - generate token
     - view token history

  2. Onboarding Application Review
     - view pending / approved / rejected applications

  Responsive:
  - On small screens, cards stack vertically.
  - On medium and larger screens, cards show side by side.
*/
export default function HiringManagementPage() {
  const navigate = useNavigate();

  return (
    <Layout>
      <h1 className="mb-4">Hiring Management</h1>

      <Row className="g-3">
        <Col xs={12} md={6}>
          <DashboardCard
            title="Registration Token"
            description="Generate token & view token history."
            onClick={() =>
              navigate("/hr/hiring-management/registration-token")
            }
          />
        </Col>

        <Col xs={12} md={6}>
          <DashboardCard
            title="Onboarding Application Review"
            description="View onboarding applications."
            onClick={() =>
              navigate("/hr/hiring-management/onboarding-review")
            }
          />
        </Col>
      </Row>
    </Layout>
  );
}