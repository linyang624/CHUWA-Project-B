import DataTable from "../common/DataTable";
import StatusBadge from "../common/StatusBadge";
import { formatDateTime } from "../../utils/formatDate";

/*
  RegistrationTokenTable

  Shows token sending history.

  Row fields:
  - email address
  - person's name
  - registration link
  - onboarding status

  Responsive:
  - Uses DataTable, which uses Bootstrap responsive table.
*/
export default function RegistrationTokenTable({ tokens = [] }) {
  const columns = [
    { key: "email", label: "Email Address" },
    { key: "name", label: "Person's Name" },
    { key: "link", label: "Registration Link" },
    { key: "onboardingStatus", label: "Onboarding Status" },
    { key: "expiresAt", label: "Expires At" },
  ];

  const renderOnboardingStatus = (token) => {
    if (token.onboardingSubmitted) {
      return <StatusBadge status="submitted" />;
    }

    return <StatusBadge status={token.linkStatus || "active"} />;
  };

  return (
    <DataTable
      columns={columns}
      data={tokens}
      emptyMessage="No registration tokens found."
      renderRow={(token) => (
        <tr key={token._id}>
          <td>{token.email}</td>
          <td>
            {token.firstName} {token.lastName}
          </td>
          <td>
            {token.registrationLink ? (
              <a
                href={token.registrationLink}
                target="_blank"
                rel="noreferrer"
              >
                Open Link
              </a>
            ) : (
              "N/A"
            )}
          </td>
          <td>{renderOnboardingStatus(token)}</td>
          <td>{formatDateTime(token.expiresAt)}</td>
        </tr>
      )}
    />
  );
}