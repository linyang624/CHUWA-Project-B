import { Nav } from "react-bootstrap";

/*
  ApplicationStatusTabs

  Used in OnboardingReviewPage.

  It lets HR switch between:
  - Pending
  - Approved
  - Rejected

  Responsive:
  - Bootstrap nav tabs naturally wrap on small screens.
*/
export default function ApplicationStatusTabs({ activeStatus, onChange }) {
  return (
    <>
      <Nav
        activeKey={activeStatus}
        className="chuwa-application-tabs mb-4 d-flex flex-wrap gap-2"
        style={{
          background: "#ffffff",
          border: "1px solid #e5e7eb",
          borderRadius: "18px",
          padding: "8px",
          boxShadow: "0 8px 20px rgba(15, 23, 42, 0.04)",
          fontFamily:
            "Arial, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        }}
      >
        <Nav.Item>
          <Nav.Link
            eventKey="pending"
            onClick={() => onChange("pending")}
            className="chuwa-application-tab"
          >
            Pending
          </Nav.Link>
        </Nav.Item>

        <Nav.Item>
          <Nav.Link
            eventKey="approved"
            onClick={() => onChange("approved")}
            className="chuwa-application-tab"
          >
            Approved
          </Nav.Link>
        </Nav.Item>

        <Nav.Item>
          <Nav.Link
            eventKey="rejected"
            onClick={() => onChange("rejected")}
            className="chuwa-application-tab"
          >
            Rejected
          </Nav.Link>
        </Nav.Item>
      </Nav>

      <style>
        {`
          .chuwa-application-tabs .chuwa-application-tab {
            border-radius: 999px;
            border: none;
            color: #4b5563;
            font-size: 14px;
            font-weight: 800;
            padding: 9px 18px;
            transition: all 0.18s ease;
          }

          .chuwa-application-tabs .chuwa-application-tab:hover {
            background: #eef2ff;
            color: #4f46e5;
          }

          .chuwa-application-tabs .chuwa-application-tab.active {
            background: linear-gradient(135deg, #2563eb, #4f46e5);
            color: #ffffff;
            box-shadow: 0 8px 16px rgba(37, 99, 235, 0.18);
          }

          @media (max-width: 576px) {
            .chuwa-application-tabs .chuwa-application-tab {
              padding: 8px 14px;
              font-size: 13px;
            }
          }
        `}
      </style>
    </>
  );
}