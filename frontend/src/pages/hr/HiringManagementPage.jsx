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
          Hiring Management
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
          Generate employee registration links and review onboarding applications.
        </p>
      </div>

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