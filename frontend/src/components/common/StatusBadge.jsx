import { Badge } from "react-bootstrap";

import {
  formatStatusText,
  getStatusBadgeVariant,
} from "../../utils/visaUtils";

/*
  StatusBadge component

  Used to display backend status values in a readable way.

  Backend values:
  - pending
  - approved
  - rejected
  - active
  - expired
  - used
  - completed

  HR examples:
  - onboarding application status
  - registration token link status
  - visa document status

  Employee examples:
  - onboarding status
  - visa document status
*/
export default function StatusBadge({ status }) {
  if (!status) {
    return (
      <Badge
        bg="secondary"
        pill
        style={{
          padding: "7px 12px",
          fontSize: "12px",
          fontWeight: "800",
          letterSpacing: "0.02em",
          borderRadius: "999px",
          backgroundColor: "#f3f4f6",
          color: "#6b7280",
          fontFamily:
            "Arial, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        }}
      >
        N/A
      </Badge>
    );
  }

  return (
    <Badge
      bg={getStatusBadgeVariant(status)}
      pill
      style={{
        padding: "7px 12px",
        fontSize: "12px",
        fontWeight: "800",
        letterSpacing: "0.02em",
        borderRadius: "999px",
        fontFamily:
          "Arial, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >
      {formatStatusText(status)}
    </Badge>
  );
}