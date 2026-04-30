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

        <ButtonGroup
          size="sm"
          style={{
            borderRadius: "999px",
            overflow: "hidden",
            boxShadow: "0 4px 12px rgba(15, 23, 42, 0.06)",
          }}
        >
          <Button
            variant="outline-success"
            onClick={() => onApproveDocument(currentDocumentId)}
            style={{
              fontSize: "12px",
              fontWeight: "800",
              padding: "6px 12px",
              background: "#ffffff",
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
              background: "#ffffff",
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
        style={{
          borderRadius: "999px",
          borderColor: "#c7d2fe",
          color: "#4f46e5",
          background: "#ffffff",
          fontSize: "12px",
          fontWeight: "800",
          padding: "7px 14px",
          boxShadow: "0 4px 12px rgba(15, 23, 42, 0.06)",
          whiteSpace: "nowrap",
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