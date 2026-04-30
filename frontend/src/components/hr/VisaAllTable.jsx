import DataTable from "../common/DataTable";
import DocumentActions from "../common/DocumentActions";
import { formatDate } from "../../utils/formatDate";
import {
  calculateDaysRemaining,
  formatVisaTitle,
  getVisaNextStepText,
} from "../../utils/visaUtils";

/*
  VisaAllTable

  Used in VisaStatusManagementPage -> All tab.

  It shows all OPT/F1 visa status records, including finished ones.

  Row fields:
  - Legal Full Name
  - Work Authorization
  - Next Step / Finished
  - OPT Receipt
  - OPT EAD
  - I-983
  - I-20

  Important:
  Backend returns approvedDocuments as an array:
  [
    {
      type: "opt_receipt",
      label: "OPT Receipt",
      document: {...}
    }
  ]

  So the frontend needs to find the item by type,
  then pass item.document to DocumentActions.
*/
export default function VisaAllTable({ visaStatuses = [] }) {
  const columns = [
    { key: "name", label: "Legal Full Name" },
    { key: "workAuthorization", label: "Work Authorization" },
    { key: "nextStep", label: "Next Step" },
    { key: "optReceipt", label: "OPT Receipt" },
    { key: "optEad", label: "OPT EAD" },
    { key: "i983", label: "I-983" },
    { key: "i20", label: "I-20" },
  ];

  const getVisaStatusId = (visaStatus) => {
    return (
      visaStatus.visaStatusId ||
      visaStatus._id ||
      visaStatus.id ||
      visaStatus.employeeId
    );
  };

  const getLegalFullName = (visaStatus) => {
    const firstName =
      visaStatus.firstName ||
      visaStatus.employee?.firstName ||
      visaStatus.user?.firstName ||
      "";

    const lastName =
      visaStatus.lastName ||
      visaStatus.employee?.lastName ||
      visaStatus.user?.lastName ||
      "";

    const fullName = `${firstName} ${lastName}`.trim();

    return fullName || visaStatus.legalFullName || "N/A";
  };

  const getWorkAuthorization = (visaStatus) => {
    return (
      visaStatus.workAuthorization ||
      visaStatus.employee?.workAuthorization ||
      {}
    );
  };

  /*
    Get one approved visa document from backend response.

    Backend approvedDocuments item shape:
    {
      type: "opt_receipt" | "opt_ead" | "i_983" | "i_20",
      label: "...",
      document: {...}
    }
  */
  const getDocument = (visaStatus, type) => {
    const approvedDocuments = visaStatus.approvedDocuments || [];

    const matchedItem = approvedDocuments.find((item) => item.type === type);

    return matchedItem?.document || null;
  };

  return (
    <DataTable
      columns={columns}
      data={visaStatuses}
      emptyMessage="No visa statuses found."
      renderRow={(visaStatus) => {
        const workAuthorization = getWorkAuthorization(visaStatus);
        const startDate = workAuthorization.startDate || visaStatus.startDate;
        const endDate = workAuthorization.endDate || visaStatus.endDate;

        return (
          <tr key={getVisaStatusId(visaStatus)}>
            <td>
              <span
                style={{
                  fontWeight: "800",
                  color: "#1f2937",
                  whiteSpace: "nowrap",
                }}
              >
                {getLegalFullName(visaStatus)}
              </span>
            </td>

            <td>
              <div
                className="d-flex flex-column gap-1"
                style={{
                  minWidth: "220px",
                  color: "#4b5563",
                  fontSize: "13px",
                  lineHeight: "1.5",
                }}
              >
                <div>
                  <span style={{ fontWeight: "800", color: "#374151" }}>
                    Title:
                  </span>{" "}
                  {formatVisaTitle(
                    workAuthorization.visaTitle ||
                      workAuthorization.title ||
                      visaStatus.visaTitle,
                    workAuthorization.otherTitle
                  )}
                </div>

                <div>
                  <span style={{ fontWeight: "800", color: "#374151" }}>
                    Start Date:
                  </span>{" "}
                  {formatDate(startDate)}
                </div>

                <div>
                  <span style={{ fontWeight: "800", color: "#374151" }}>
                    End Date:
                  </span>{" "}
                  {formatDate(endDate)}
                </div>

                <div>
                  <span style={{ fontWeight: "800", color: "#374151" }}>
                    Days Remaining:
                  </span>{" "}
                  {calculateDaysRemaining(endDate)}
                </div>
              </div>
            </td>

            <td>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  padding: "7px 12px",
                  borderRadius: "999px",
                  background:
                    visaStatus.isFinished ||
                    visaStatus.status === "finished" ||
                    visaStatus.currentStep === "completed"
                      ? "#ecfdf3"
                      : "#eef2ff",
                  color:
                    visaStatus.isFinished ||
                    visaStatus.status === "finished" ||
                    visaStatus.currentStep === "completed"
                      ? "#166534"
                      : "#4f46e5",
                  fontSize: "12px",
                  fontWeight: "800",
                  whiteSpace: "nowrap",
                }}
              >
                {visaStatus.isFinished ||
                visaStatus.status === "finished" ||
                visaStatus.currentStep === "completed"
                  ? "Finished"
                  : getVisaNextStepText(visaStatus)}
              </span>
            </td>

            <td>
              <DocumentActions
                document={getDocument(visaStatus, "opt_receipt")}
                showPreview={true}
                showDownload={true}
              />
            </td>

            <td>
              <DocumentActions
                document={getDocument(visaStatus, "opt_ead")}
                showPreview={true}
                showDownload={true}
              />
            </td>

            <td>
              <DocumentActions
                document={getDocument(visaStatus, "i_983")}
                showPreview={true}
                showDownload={true}
              />
            </td>

            <td>
              <DocumentActions
                document={getDocument(visaStatus, "i_20")}
                showPreview={true}
                showDownload={true}
              />
            </td>
          </tr>
        );
      }}
    />
  );
}