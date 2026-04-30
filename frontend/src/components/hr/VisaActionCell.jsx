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
      <div
        className="d-flex flex-column gap-2"
        style={{
          minWidth: "180px",
          fontFamily:
            "Arial, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        }}
      >
        <DocumentActions
          document={currentDocument}
          showPreview={true}
          showDownload={false}
        />

        <ButtonGroup size="sm">
          <Button
            variant="outline-success"
            onClick={() => onApproveDocument(currentDocumentId)}
            style={{
              fontSize: "12px",
              fontWeight: "800",
              padding: "6px 12px",
            }}
          >
            Approve
          </Button>

          <Button
            variant="outline-danger"
            onClick={() => onRejectDocument(currentDocumentId)}
            style={{
              fontSize: "12px",
              fontWeight: "800",
              padding: "6px 12px",
            }}
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
        className="fw-bold text-nowrap px-3"
        style={{
          fontSize: "12px",
        }}
      >
        Send Notification
      </Button>
    );
  }

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "30px",
        padding: "4px 10px",
        borderRadius: "999px",
        background: "#f3f4f6",
        color: "#6b7280",
        fontSize: "12px",
        fontWeight: "800",
        fontFamily:
          "Arial, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >
      N/A
    </span>
  );
}