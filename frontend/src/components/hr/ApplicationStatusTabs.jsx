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
    <Nav variant="tabs" activeKey={activeStatus} className="mb-3">
      <Nav.Item>
        <Nav.Link eventKey="pending" onClick={() => onChange("pending")}>
          Pending
        </Nav.Link>
      </Nav.Item>

      <Nav.Item>
        <Nav.Link eventKey="approved" onClick={() => onChange("approved")}>
          Approved
        </Nav.Link>
      </Nav.Item>

      <Nav.Item>
        <Nav.Link eventKey="rejected" onClick={() => onChange("rejected")}>
          Rejected
        </Nav.Link>
      </Nav.Item>
    </Nav>
  );
}