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
    return <Badge bg="secondary">N/A</Badge>;
  }

  return (
    <Badge bg={getStatusBadgeVariant(status)}>
      {formatStatusText(status)}
    </Badge>
  );
}