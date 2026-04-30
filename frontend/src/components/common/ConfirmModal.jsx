import { Button, Modal } from "react-bootstrap";

/*
  Reusable confirm modal.

  HR examples:
  - confirm approve application
  - confirm approve visa document
  - confirm send notification

  Employee examples:
  - confirm discard changes
  - confirm submit onboarding form

  Responsive:
  - React Bootstrap Modal is responsive by default
*/
export default function ConfirmModal({
  show,
  title = "Confirm Action",
  message = "Are you sure you want to continue?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  loading = false,
  onClose,
  onConfirm,
}) {
  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header
        closeButton
        style={{
          borderBottom: "1px solid #eef2f7",
          padding: "20px 24px",
          fontFamily:
            "Arial, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        }}
      >
        <Modal.Title
          style={{
            fontSize: "22px",
            fontWeight: "800",
            color: "#1f2937",
            letterSpacing: "-0.04em",
          }}
        >
          {title}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body
        style={{
          padding: "22px 24px",
          fontFamily:
            "Arial, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        }}
      >
        <p
          className="mb-0"
          style={{
            color: "#4b5563",
            fontSize: "15px",
            lineHeight: "1.65",
            fontWeight: "500",
          }}
        >
          {message}
        </p>
      </Modal.Body>

      <Modal.Footer
        style={{
          borderTop: "1px solid #eef2f7",
          padding: "16px 24px",
          fontFamily:
            "Arial, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        }}
      >
        <Button
          variant="secondary"
          onClick={onClose}
          disabled={loading}
          style={{
            borderRadius: "999px",
            padding: "8px 18px",
            fontWeight: "700",
            fontSize: "14px",
            border: "1px solid #d8dee8",
            background: "#ffffff",
            color: "#374151",
          }}
        >
          {cancelText}
        </Button>

        <Button
          variant="primary"
          onClick={onConfirm}
          disabled={loading}
          style={{
            borderRadius: "999px",
            padding: "8px 20px",
            fontWeight: "700",
            fontSize: "14px",
            border: "none",
            background: loading
              ? "#a5b4fc"
              : "linear-gradient(135deg, #2563eb, #4f46e5)",
            boxShadow: loading
              ? "none"
              : "0 8px 16px rgba(37, 99, 235, 0.18)",
          }}
        >
          {loading ? "Processing..." : confirmText}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}