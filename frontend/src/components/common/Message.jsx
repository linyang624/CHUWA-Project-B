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

  const getStyleByVariant = () => {
    if (variant === "success") {
      return {
        background: "#ecfdf3",
        borderColor: "#bbf7d0",
        color: "#166534",
      };
    }

    if (variant === "danger") {
      return {
        background: "#fef2f2",
        borderColor: "#fecaca",
        color: "#991b1b",
      };
    }

    if (variant === "warning") {
      return {
        background: "#fffbeb",
        borderColor: "#fde68a",
        color: "#92400e",
      };
    }

    return {
      background: "#eef2ff",
      borderColor: "#c7d2fe",
      color: "#3730a3",
    };
  };

  return (
    <Alert
      variant={variant}
      className="mb-3"
      style={{
        ...getStyleByVariant(),
        borderRadius: "14px",
        borderWidth: "1px",
        fontSize: "14px",
        fontWeight: "600",
        lineHeight: "1.55",
        padding: "14px 16px",
        fontFamily:
          "Arial, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >
      {children}
    </Alert>
  );
}