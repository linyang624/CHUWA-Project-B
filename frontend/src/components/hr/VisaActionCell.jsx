import { Button, ButtonGroup } from "react-bootstrap";

import DocumentActions from "../common/DocumentActions";
import { getVisaNextStepText } from "../../utils/visaUtils";

export default function VisaActionCell({
  visaStatus,
  onApproveDocument,
  onRejectDocument,
  onSendNotification,
}) {
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
  const nextStepText = getVisaNextStepText(visaStatus).toLowerCase();

  const isWaitingHrApproval =
    nextStepType === "wait_hr_approval" ||
    currentDocument?.status === "pending" ||
    visaStatus.currentDocumentStatus === "pending" ||
    nextStepText.includes("waiting for hr");

  const isWaitingEmployee =
    nextStepType === "wait_employee_upload" ||
    nextStepType === "wait_employee_reupload" ||
    visaStatus.waitingForEmployee === true ||
    nextStepText.includes("waiting for employee");

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