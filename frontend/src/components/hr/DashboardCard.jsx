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
      className="h-100 border-0"
      role={onClick ? "button" : undefined}
      onClick={onClick}
      style={{
        borderRadius: "20px",
        boxShadow: "0 10px 24px rgba(15, 23, 42, 0.05)",
        cursor: onClick ? "pointer" : "default",
        transition: "transform 0.18s ease, box-shadow 0.18s ease",
        fontFamily:
          "Arial, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        overflow: "hidden",
      }}
      onMouseEnter={(event) => {
        if (!onClick) return;
        event.currentTarget.style.transform = "translateY(-3px)";
        event.currentTarget.style.boxShadow =
          "0 16px 32px rgba(15, 23, 42, 0.08)";
      }}
      onMouseLeave={(event) => {
        if (!onClick) return;
        event.currentTarget.style.transform = "translateY(0)";
        event.currentTarget.style.boxShadow =
          "0 10px 24px rgba(15, 23, 42, 0.05)";
      }}
    >
      <Card.Body className="p-4">
        <Card.Title
          className="mb-3"
          style={{
            color: "#374151",
            fontSize: "15px",
            fontWeight: "800",
            letterSpacing: "-0.02em",
          }}
        >
          {title}
        </Card.Title>

        {value !== undefined && (
          <h3
            className="mb-2"
            style={{
              color: "#1f2937",
              fontSize: "38px",
              fontWeight: "900",
              letterSpacing: "-0.05em",
              lineHeight: "1",
            }}
          >
            {value}
          </h3>
        )}

        {description && (
          <Card.Text
            className="mb-0"
            style={{
              color: "#6b7280",
              fontSize: "14px",
              fontWeight: "600",
              lineHeight: "1.55",
            }}
          >
            {description}
          </Card.Text>
        )}
      </Card.Body>
    </Card>
  );
}