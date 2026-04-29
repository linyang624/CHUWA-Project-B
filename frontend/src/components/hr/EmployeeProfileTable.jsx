import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import DataTable from "../common/DataTable";
import { getLegalFullName } from "../../utils/formatName";
import { formatVisaTitle } from "../../utils/visaUtils";

/*
  EmployeeProfileTable

  Used by HR to view employee profile summary.

  Row fields:
  - Legal Full Name
  - SSN
  - Work Authorization Title
  - Phone Number
  - Email

  Legal Full Name is clickable and opens employee detail page.

  Responsive:
  - Uses DataTable, which uses Bootstrap responsive table.
*/
export default function EmployeeProfileTable({ employees = [] }) {
  const navigate = useNavigate();

  const columns = [
    { key: "legalFullName", label: "Legal Full Name" },
    { key: "ssn", label: "SSN" },
    { key: "workAuthorization", label: "Work Authorization Title" },
    { key: "phoneNumber", label: "Phone Number" },
    { key: "email", label: "Email" },
  ];

  const getEmployeeId = (employee) => {
    return employee.user?._id || employee.user || employee.userId || employee._id || employee.id;
  };

  const handleViewDetail = (employee) => {
    const employeeId = getEmployeeId(employee);
    navigate(`/hr/employee-profiles/${employeeId}`);
  };

  return (
    <DataTable
      columns={columns}
      data={employees}
      emptyMessage="No employees found."
      renderRow={(employee) => (
        <tr key={getEmployeeId(employee)}>
          <td>
            <Button
              variant="link"
              className="p-0"
              onClick={() => handleViewDetail(employee)}
            >
              {getLegalFullName(employee)}
            </Button>
          </td>

          <td>{employee.ssn || "N/A"}</td>

          <td>
            {formatVisaTitle(
              employee.workAuthorization?.visaTitle || employee.workAuthorization?.title
              || employee.workAuthorizationTitle, employee.workAuthorization?.otherTitle
            )}
          </td>

          <td>{employee.phoneNumber || "N/A"}</td>

          <td>{employee.email || "N/A"}</td>
        </tr>
      )}
    />
  );
}