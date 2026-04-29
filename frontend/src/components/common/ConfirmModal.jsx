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
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <p className="mb-0">{message}</p>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onClose} disabled={loading}>
          {cancelText}
        </Button>

        <Button variant="primary" onClick={onConfirm} disabled={loading}>
          {loading ? "Processing..." : confirmText}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}