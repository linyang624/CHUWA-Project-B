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
                  background: "#eef2ff",
                  color: "#4f46e5",
                  fontSize: "12px",
                  fontWeight: "800",
                  whiteSpace: "nowrap",
                }}
              >
                {getVisaNextStepText(visaStatus)}
              </span>
            </td>

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