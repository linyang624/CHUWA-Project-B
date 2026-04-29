import { Card, Col, Row } from "react-bootstrap";

import DocumentActions from "../common/DocumentActions";
import { formatDate } from "../../utils/formatDate";
import { formatVisaTitle } from "../../utils/visaUtils";

/*
  EmployeeProfileDetail

  Used by HR to view one employee's full profile.

  This detail is created from approved onboarding application data.

  Responsive:
  - Uses Row and Col.
  - On small screens, fields stack vertically.
  - On larger screens, fields show in two-column or three-column layout.
*/
export default function EmployeeProfileDetail({ employee }) {
  if (!employee) {
    return null;
  }

  return (
    <div>
      {/* Basic Information */}
      <Card className="mb-3">
        <Card.Body>
          <Card.Title>Basic Information</Card.Title>

          <Row className="g-3">
            <Col xs={12} md={6}>
              <strong>First Name:</strong>
              <div>{employee.firstName || "N/A"}</div>
            </Col>

            <Col xs={12} md={6}>
              <strong>Last Name:</strong>
              <div>{employee.lastName || "N/A"}</div>
            </Col>

            <Col xs={12} md={6}>
              <strong>Middle Name:</strong>
              <div>{employee.middleName || "N/A"}</div>
            </Col>

            <Col xs={12} md={6}>
              <strong>Preferred Name:</strong>
              <div>{employee.preferredName || "N/A"}</div>
            </Col>

            <Col xs={12} md={6}>
              <strong>Email:</strong>
              <div>{employee.email || "N/A"}</div>
            </Col>

            <Col xs={12} md={6}>
              <strong>Phone Number:</strong>
              <div>{employee.phoneNumber || "N/A"}</div>
            </Col>

            <Col xs={12} md={6}>
              <strong>SSN:</strong>
              <div>{employee.ssn || "N/A"}</div>
            </Col>

            <Col xs={12} md={6}>
              <strong>Date of Birth:</strong>
              <div>{formatDate(employee.dateOfBirth)}</div>
            </Col>

            <Col xs={12} md={6}>
              <strong>Gender:</strong>
              <div>{employee.gender || "N/A"}</div>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Address */}
      <Card className="mb-3">
        <Card.Body>
          <Card.Title>Address</Card.Title>

          <Row className="g-3">
            <Col xs={12}>
              <strong>Street Address:</strong>
              <div>{employee.address?.street || "N/A"}</div>
            </Col>

            <Col xs={12} md={4}>
              <strong>City:</strong>
              <div>{employee.address?.city || "N/A"}</div>
            </Col>

            <Col xs={12} md={4}>
              <strong>State:</strong>
              <div>{employee.address?.state || "N/A"}</div>
            </Col>

            <Col xs={12} md={4}>
              <strong>Zip Code:</strong>
              <div>{employee.address?.zipCode || "N/A"}</div>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Work Authorization */}
      <Card className="mb-3">
        <Card.Body>
          <Card.Title>Work Authorization</Card.Title>

          <Row className="g-3">
            <Col xs={12} md={6}>
              <strong>Work Authorization Title:</strong>
              <div>
                {formatVisaTitle(
                  employee.workAuthorization?.title || employee.workAuthorizationTitle,
                  employee.workAuthorization?.otherTitle
                )}
              </div>
            </Col>

            <Col xs={12} md={6}>
              <strong>Start Date:</strong>
              <div>{formatDate(employee.workAuthorization?.startDate)}</div>
            </Col>

            <Col xs={12} md={6}>
              <strong>End Date:</strong>
              <div>{formatDate(employee.workAuthorization?.endDate)}</div>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Emergency Contact */}
      <Card className="mb-3">
        <Card.Body>
          <Card.Title>Emergency Contact</Card.Title>

          <Row className="g-3">
            <Col xs={12} md={6}>
              <strong>First Name:</strong>
              <div>{employee.emergencyContact?.firstName || "N/A"}</div>
            </Col>

            <Col xs={12} md={6}>
              <strong>Last Name:</strong>
              <div>{employee.emergencyContact?.lastName || "N/A"}</div>
            </Col>

            <Col xs={12} md={6}>
              <strong>Middle Name:</strong>
              <div>{employee.emergencyContact?.middleName || "N/A"}</div>
            </Col>

            <Col xs={12} md={6}>
              <strong>Phone Number:</strong>
              <div>{employee.emergencyContact?.phoneNumber || "N/A"}</div>
            </Col>

            <Col xs={12} md={6}>
              <strong>Email:</strong>
              <div>{employee.emergencyContact?.email || "N/A"}</div>
            </Col>

            <Col xs={12} md={6}>
              <strong>Relationship:</strong>
              <div>{employee.emergencyContact?.relationship || "N/A"}</div>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Documents */}
      <Card className="mb-3">
        <Card.Body>
          <Card.Title>Documents</Card.Title>

          <Row className="g-3">
            <Col xs={12} md={6}>
              <strong>Driver License:</strong>
              <div className="mt-2">
                <DocumentActions document={employee.driverLicense} />
              </div>
            </Col>

            <Col xs={12} md={6}>
              <strong>OPT Receipt:</strong>
              <div className="mt-2">
                <DocumentActions document={employee.optReceipt} />
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </div>
  );
}