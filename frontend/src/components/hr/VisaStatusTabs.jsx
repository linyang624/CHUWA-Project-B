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
    <Nav variant="tabs" activeKey={activeTab} className="mb-3">
      <Nav.Item>
        <Nav.Link eventKey="inProgress" onClick={() => onChange("inProgress")}>
          In Progress
        </Nav.Link>
      </Nav.Item>

      <Nav.Item>
        <Nav.Link eventKey="all" onClick={() => onChange("all")}>
          All
        </Nav.Link>
      </Nav.Item>
    </Nav>
  );
}