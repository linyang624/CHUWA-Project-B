import { Button } from "react-bootstrap";

import DataTable from "../common/DataTable";
import { getLegalFullName } from "../../utils/formatName";

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

    window.open(
      `/hr/hiring-management/applications/${applicationId}`,
      "_blank"
    );
  };

  return (
    <DataTable
      columns={columns}
      data={applications}
      emptyMessage="No applications found."
      renderRow={(application) => (
        <tr key={getApplicationId(application)}>
          <td>{application.firstName || "N/A"}</td>
          <td>{application.lastName || "N/A"}</td>
          <td>{application.email || "N/A"}</td>
          <td>
            <Button
              variant="link"
              className="p-0"
              onClick={() => handleViewApplication(application)}
            >
              View Application
            </Button>
          </td>
        </tr>
      )}
    />
  );
}