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
  ];

  const renderOnboardingStatus = (token) => {
    if (token.onboardingSubmitted) {
      return <StatusBadge status="submitted" />;
    }

    return <StatusBadge status="not_submitted" />;
  };

  return (
    <DataTable
      columns={columns}
      data={tokens}
      emptyMessage="No registration tokens found."
      renderRow={(token) => (
        <tr key={token._id}>
          <td>
            <span
              style={{
                color: "#374151",
                fontWeight: "700",
                whiteSpace: "nowrap",
              }}
            >
              {token.email}
            </span>
          </td>

          <td>
            <span
              style={{
                color: "#1f2937",
                fontWeight: "800",
                whiteSpace: "nowrap",
              }}
            >
              {token.firstName} {token.lastName}
            </span>
          </td>

          <td>
            {token.registrationLink ? (
              <a
                href={token.registrationLink}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  padding: "7px 12px",
                  borderRadius: "999px",
                  background: "#eef2ff",
                  color: "#4f46e5",
                  fontSize: "12px",
                  fontWeight: "800",
                  textDecoration: "none",
                  whiteSpace: "nowrap",
                }}
              >
                Open Link
              </a>
            ) : (
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  padding: "7px 12px",
                  borderRadius: "999px",
                  background: "#f3f4f6",
                  color: "#6b7280",
                  fontSize: "12px",
                  fontWeight: "800",
                  whiteSpace: "nowrap",
                }}
              >
                N/A
              </span>
            )}
          </td>

          <td>{renderOnboardingStatus(token)}</td>
        </tr>
      )}
    />
  );
}