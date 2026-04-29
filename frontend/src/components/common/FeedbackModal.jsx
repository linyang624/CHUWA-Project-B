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
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form.Group>
          <Form.Label>{label}</Form.Label>
          <Form.Control
            as="textarea"
            rows={4}
            value={feedback}
            placeholder={placeholder}
            onChange={(event) => setFeedback(event.target.value)}
          />
        </Form.Group>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onClose} disabled={loading}>
          {cancelText}
        </Button>

        <Button
          variant="primary"
          onClick={handleConfirm}
          disabled={loading || !feedback.trim()}
        >
          {loading ? "Saving..." : confirmText}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}