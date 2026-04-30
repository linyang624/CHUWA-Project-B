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
                <Link
                  to={`/hr/employee-profiles/${employeeId}`}
                  style={{
                    color: "#4f46e5",
                    fontWeight: "800",
                    textDecoration: "none",
                    whiteSpace: "nowrap",
                  }}
                >
                  {getLegalFullName(employee)}
                </Link>
              ) : (
                <span
                  style={{
                    color: "#1f2937",
                    fontWeight: "800",
                    whiteSpace: "nowrap",
                  }}
                >
                  {getLegalFullName(employee)}
                </span>
              )}
            </td>

            <td>
              <span style={{ whiteSpace: "nowrap" }}>
                {employee.ssn || "N/A"}
              </span>
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
                {getWorkAuthorizationTitle(employee)}
              </span>
            </td>

            <td>
              <span style={{ whiteSpace: "nowrap" }}>
                {getPhoneNumber(employee)}
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
                {getEmail(employee)}
              </span>
            </td>
          </tr>
        );
      }}
    />
  );
}