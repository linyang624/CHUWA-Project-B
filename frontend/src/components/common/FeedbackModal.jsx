import { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";

/*
  Reusable feedback modal.

  HR examples:
  - reject onboarding application with feedback
  - reject visa document with feedback

  Responsive:
  - React Bootstrap Modal is responsive by default
  - on small screens, modal width adjusts automatically
*/
export default function FeedbackModal({
  show,
  title = "Feedback",
  label = "Feedback",
  placeholder = "Enter feedback...",
  confirmText = "Confirm",
  cancelText = "Cancel",
  loading = false,
  onClose,
  onConfirm,
}) {
  const [feedback, setFeedback] = useState("");

  /*
    Clear feedback every time the modal is opened.
  */
  useEffect(() => {
    if (show) {
      setFeedback("");
    }
  }, [show]);

  const handleConfirm = () => {
    onConfirm(feedback);
  };

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
        <Form.Group>
          <Form.Label
            style={{
              fontWeight: "700",
              color: "#374151",
              fontSize: "14px",
              marginBottom: "8px",
            }}
          >
            {label}
          </Form.Label>

          <Form.Control
            as="textarea"
            rows={4}
            value={feedback}
            placeholder={placeholder}
            onChange={(event) => setFeedback(event.target.value)}
            style={{
              borderRadius: "14px",
              border: "1px solid #d8dee8",
              fontSize: "14px",
              lineHeight: "1.6",
              padding: "12px 14px",
              resize: "vertical",
              minHeight: "120px",
            }}
          />
        </Form.Group>
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
          variant="outline-secondary"
          onClick={onClose}
          disabled={loading}
          className="fw-bold px-3"
        >
          {cancelText}
        </Button>

        <Button
          variant="primary"
          onClick={handleConfirm}
          disabled={loading || !feedback.trim()}
          className="fw-bold px-3"
        >
          {loading ? "Saving..." : confirmText}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}