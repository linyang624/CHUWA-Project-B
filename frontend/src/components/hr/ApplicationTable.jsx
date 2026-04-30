import { Button } from "react-bootstrap";

import DataTable from "../common/DataTable";

/*
  ApplicationTable

  Used by HR to view onboarding applications.

  Row fields:
  - First Name
  - Last Name
  - Email
  - View Application

  View Application opens the detail page in a new browser tab.

  Responsive:
  - Uses DataTable, which uses Bootstrap responsive table.
*/
export default function ApplicationTable({ applications = [] }) {
  const columns = [
    { key: "firstName", label: "First Name" },
    { key: "lastName", label: "Last Name" },
    { key: "email", label: "Email" },
    { key: "action", label: "Action" },
  ];

  const getApplicationId = (application) => {
    return application._id || application.id;
  };

  const handleViewApplication = (application) => {
    const applicationId = getApplicationId(application);

    window.open(`/hr/hiring-management/applications/${applicationId}`, "_blank");
  };

  return (
    <DataTable
      columns={columns}
      data={applications}
      emptyMessage="No applications found."
      renderRow={(application) => (
        <tr key={getApplicationId(application)}>
          <td>
            <span
              style={{
                color: "#1f2937",
                fontWeight: "800",
                whiteSpace: "nowrap",
              }}
            >
              {application.firstName || "N/A"}
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
              {application.lastName || "N/A"}
            </span>
          </td>

          <td>
            <span
              style={{
                color: "#374151",
                fontWeight: "600",
                whiteSpace: "nowrap",
              }}
            >
              {application.email || "N/A"}
            </span>
          </td>

          <td>
            <Button
              variant="outline-primary"
              size="sm"
              onClick={() => handleViewApplication(application)}
              className="fw-bold text-nowrap px-3"
              style={{
                fontSize: "12px",
              }}
            >
              View Application
            </Button>
          </td>
        </tr>
      )}
    />
  );
}