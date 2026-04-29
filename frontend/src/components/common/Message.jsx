import { Alert } from "react-bootstrap";

/*
  Message component

  Used to show success, error, warning, or info messages.

  variant examples:
  - "success"
  - "danger"
  - "warning"
  - "info"

  HR examples:
  - token generated successfully
  - failed to approve application
  - visa notification sent

  Employee examples:
  - application submitted
  - document uploaded
  - waiting for HR review
*/
export default function Message({ variant = "info", children }) {
  if (!children) {
    return null;
  }

  return (
    <Alert variant={variant} className="mb-3">
      {children}
    </Alert>
  );
}