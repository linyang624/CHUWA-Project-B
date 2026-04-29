import { Button, ButtonGroup } from "react-bootstrap";

import DocumentActions from "../common/DocumentActions";

/*
  VisaActionCell

  Used in VisaInProgressTable.

  It shows different actions based on the current visa status step.

  Cases:
  1. Employee uploaded a document and waits for HR approval:
     - Preview
     - Approve
     - Reject

  2. HR is waiting for employee to upload or reupload document:
     - Send Notification

  Responsive:
  - Buttons are small.
  - Parent table is responsive, so this cell can scroll horizontally on small screens.
*/
export default function VisaActionCell({
  visaStatus,
  onApproveDocument,
  onRejectDocument,
  onSendNotification,
}) {
  /*
    These field names may need to be adjusted based on backend response.

    Expected idea:
    - currentDocument: the document currently waiting for HR review
    - currentDocumentStatus: pending / approved / rejected
    - nextStepType: wait_hr_approval / wait_employee_upload / wait_employee_reupload
  */
  const currentDocument =
    visaStatus.currentDocument ||
    visaStatus.pendingDocument ||
    visaStatus.latestDocument ||
    null;

  const currentDocumentId =
    currentDocument?._id ||
    currentDocument?.id ||
    visaStatus.currentDocumentId ||
    visaStatus.pendingDocumentId;

  const nextStepType = visaStatus.nextStepType || visaStatus.stepType;

  const isWaitingHrApproval =
    nextStepType === "wait_hr_approval" ||
    currentDocument?.status === "pending" ||
    visaStatus.currentDocumentStatus === "pending";

  const isWaitingEmployee =
    nextStepType === "wait_employee_upload" ||
    nextStepType === "wait_employee_reupload" ||
    visaStatus.waitingForEmployee === true;

  if (isWaitingHrApproval && currentDocumentId) {
    return (
      <div className="d-flex flex-column gap-2">
        <DocumentActions
          document={currentDocument}
          showPreview={true}
          showDownload={false}
        />

        <ButtonGroup size="sm">
          <Button
            variant="outline-success"
            onClick={() => onApproveDocument(currentDocumentId)}
          >
            Approve
          </Button>

          <Button
            variant="outline-danger"
            onClick={() => onRejectDocument(currentDocumentId)}
          >
            Reject
          </Button>
        </ButtonGroup>
      </div>
    );
  }

  if (isWaitingEmployee) {
    return (
      <Button
        size="sm"
        variant="outline-primary"
        onClick={() => onSendNotification(visaStatus)}
      >
        Send Notification
      </Button>
    );
  }

  return <span>N/A</span>;
}