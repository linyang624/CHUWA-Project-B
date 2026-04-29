import DataTable from "../common/DataTable";
import VisaActionCell from "./VisaActionCell";
import { formatDate } from "../../utils/formatDate";
import {
  calculateDaysRemaining,
  formatVisaTitle,
  getVisaNextStepText,
} from "../../utils/visaUtils";

/*
  VisaInProgressTable

  Used in VisaStatusManagementPage -> In Progress tab.

  It shows OPT/F1 employees whose visa document flow is not finished.

  Row fields:
  - Legal Full Name
  - Work Authorization
  - Next Step
  - Action

  Responsive:
  - Uses DataTable, which uses Bootstrap responsive table.
*/
export default function VisaInProgressTable({
  visaStatuses = [],
  onApproveDocument,
  onRejectDocument,
  onSendNotification,
}) {
  const columns = [
    { key: "name", label: "Legal Full Name" },
    { key: "workAuthorization", label: "Work Authorization" },
    { key: "nextStep", label: "Next Step" },
    { key: "action", label: "Action" },
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

  return (
    <DataTable
      columns={columns}
      data={visaStatuses}
      emptyMessage="No visa statuses in progress."
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

            <td>{getVisaNextStepText(visaStatus)}</td>

            <td>
              <VisaActionCell
                visaStatus={visaStatus}
                onApproveDocument={onApproveDocument}
                onRejectDocument={onRejectDocument}
                onSendNotification={onSendNotification}
              />
            </td>
          </tr>
        );
      }}
    />
  );
}