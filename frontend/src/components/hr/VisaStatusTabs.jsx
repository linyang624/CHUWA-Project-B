import { Nav } from "react-bootstrap";

/*
  VisaStatusTabs

  Used in VisaStatusManagementPage.

  HR can switch between:
  - In Progress
  - All

  Responsive:
  - Bootstrap tabs can wrap naturally on small screens.
*/
export default function VisaStatusTabs({ activeTab, onChange }) {
  return (
    <>
      <Nav
        activeKey={activeTab}
        className="chuwa-visa-tabs mb-4 d-flex flex-wrap gap-2"
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
            eventKey="inProgress"
            onClick={() => onChange("inProgress")}
            className="chuwa-visa-tab"
          >
            In Progress
          </Nav.Link>
        </Nav.Item>

        <Nav.Item>
          <Nav.Link
            eventKey="all"
            onClick={() => onChange("all")}
            className="chuwa-visa-tab"
          >
            All
          </Nav.Link>
        </Nav.Item>
      </Nav>

      <style>
        {`
          .chuwa-visa-tabs .chuwa-visa-tab {
            border-radius: 999px;
            border: none;
            color: #4b5563;
            font-size: 14px;
            font-weight: 800;
            padding: 9px 18px;
            transition: all 0.18s ease;
          }

          .chuwa-visa-tabs .chuwa-visa-tab:hover {
            background: #eef2ff;
            color: #4f46e5;
          }

          .chuwa-visa-tabs .chuwa-visa-tab.active {
            background: linear-gradient(135deg, #2563eb, #4f46e5);
            color: #ffffff;
            box-shadow: 0 8px 16px rgba(37, 99, 235, 0.18);
          }
        `}
      </style>
    </>
  );
}