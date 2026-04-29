import { Link } from "react-router-dom";

import DataTable from "../common/DataTable";
import { formatVisaTitle } from "../../utils/visaUtils";

/*
  EmployeeProfileTable

  Used in HR Employee Profiles page.

  Backend returns approved OnboardingApplication records.
  So field names should match onboarding application:
  - user._id / user.email
  - firstName / lastName / preferredName
  - ssn
  - cellPhone / workPhone
  - workAuthorization.visaTitle
*/
export default function EmployeeProfileTable({ employees = [] }) {
  const columns = [
    { key: "legalFullName", label: "Legal Full Name" },
    { key: "ssn", label: "SSN" },
    { key: "workAuthorizationTitle", label: "Work Authorization Title" },
    { key: "phoneNumber", label: "Phone Number" },
    { key: "email", label: "Email" },
  ];

  const getEmployeeId = (employee) => {
    return employee.user?._id || employee.user || employee.employeeId || employee._id;
  };

  const getLegalFullName = (employee) => {
    const fullName = `${employee.firstName || ""} ${employee.lastName || ""}`.trim();

    return fullName || employee.legalFullName || "N/A";
  };

  const getPhoneNumber = (employee) => {
    return (
      employee.cellPhone ||
      employee.phoneNumber ||
      employee.contact?.cellPhone ||
      employee.contact?.phoneNumber ||
      "N/A"
    );
  };

  const getEmail = (employee) => {
    return employee.user?.email || employee.email || "N/A";
  };

  const getWorkAuthorizationTitle = (employee) => {
    return formatVisaTitle(
      employee.workAuthorization?.visaTitle ||
        employee.workAuthorization?.title ||
        employee.workAuthorizationTitle,
      employee.workAuthorization?.otherTitle
    );
  };

  return (
    <DataTable
      columns={columns}
      data={employees}
      emptyMessage="No employees found."
      renderRow={(employee) => {
        const employeeId = getEmployeeId(employee);

        return (
          <tr key={employee._id || employeeId}>
            <td>
              {employeeId ? (
                <Link to={`/hr/employee-profiles/${employeeId}`}>
                  {getLegalFullName(employee)}
                </Link>
              ) : (
                getLegalFullName(employee)
              )}
            </td>

            <td>{employee.ssn || "N/A"}</td>

            <td>{getWorkAuthorizationTitle(employee)}</td>

            <td>{getPhoneNumber(employee)}</td>

            <td>{getEmail(employee)}</td>
          </tr>
        );
      }}
    />
  );
}