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

  Responsive:
  - Uses DataTable, which uses Bootstrap responsive table.
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
    return visaStatus._id || visaStatus.id;
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
    The backend document field names may be different.
    This helper tries several common names.
  */
  const getDocument = (visaStatus, type) => {
    if (type === "optReceipt") {
      return (
        visaStatus.optReceipt ||
        visaStatus.documents?.optReceipt ||
        visaStatus.approvedDocuments?.optReceipt ||
        null
      );
    }

    if (type === "optEad") {
      return (
        visaStatus.optEad ||
        visaStatus.optEAD ||
        visaStatus.documents?.optEad ||
        visaStatus.documents?.optEAD ||
        visaStatus.approvedDocuments?.optEad ||
        visaStatus.approvedDocuments?.optEAD ||
        null
      );
    }

    if (type === "i983") {
      return (
        visaStatus.i983 ||
        visaStatus.i_983 ||
        visaStatus.documents?.i983 ||
        visaStatus.documents?.i_983 ||
        visaStatus.approvedDocuments?.i983 ||
        visaStatus.approvedDocuments?.i_983 ||
        null
      );
    }

    if (type === "i20") {
      return (
        visaStatus.i20 ||
        visaStatus.i_20 ||
        visaStatus.documents?.i20 ||
        visaStatus.documents?.i_20 ||
        visaStatus.approvedDocuments?.i20 ||
        visaStatus.approvedDocuments?.i_20 ||
        null
      );
    }

    return null;
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
            <td>{getLegalFullName(visaStatus)}</td>

            <td>
              <div>
                <strong>Title:</strong>{" "}
                {formatVisaTitle(
                  workAuthorization.visaTitle ||
                    workAuthorization.title ||
                    visaStatus.visaTitle,
                  workAuthorization.otherTitle
                )}
              </div>

              <div>
                <strong>Start Date:</strong> {formatDate(startDate)}
              </div>

              <div>
                <strong>End Date:</strong> {formatDate(endDate)}
              </div>

              <div>
                <strong>Days Remaining:</strong>{" "}
                {calculateDaysRemaining(endDate)}
              </div>
            </td>

            <td>
              {visaStatus.isFinished || visaStatus.status === "finished"
                ? "Finished"
                : getVisaNextStepText(visaStatus)}
            </td>

            <td>
              <DocumentActions document={getDocument(visaStatus, "optReceipt")} />
            </td>

            <td>
              <DocumentActions document={getDocument(visaStatus, "optEad")} />
            </td>

            <td>
              <DocumentActions document={getDocument(visaStatus, "i983")} />
            </td>

            <td>
              <DocumentActions document={getDocument(visaStatus, "i20")} />
            </td>
          </tr>
        );
      }}
    />
  );
}