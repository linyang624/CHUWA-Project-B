import { Card } from "react-bootstrap";

/*
  DashboardCard component

  Used for HR dashboard-style pages.

  Examples:
  - HRHomePage:
    Pending Applications / Approved Employees / Visa In Progress

  - HiringManagementPage:
    Registration Token / Onboarding Application Review

  Responsive:
  - The parent page controls layout with Row and Col.
  - This card fills the width of its parent column.
*/
export default function DashboardCard({
  title,
  value,
  description,
  onClick,
}) {
  return (
    <Card
      className="h-100"
      role={onClick ? "button" : undefined}
      onClick={onClick}
    >
      <Card.Body>
        <Card.Title>{title}</Card.Title>

        {value !== undefined && (
          <h3>{value}</h3>
        )}

        {description && (
          <Card.Text>{description}</Card.Text>
        )}
      </Card.Body>
    </Card>
  );
}