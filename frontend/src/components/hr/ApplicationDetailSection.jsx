import { Card, Col, Row } from "react-bootstrap";

import DocumentActions from "../common/DocumentActions";
import StatusBadge from "../common/StatusBadge";
import { formatDate } from "../../utils/formatDate";
import { formatVisaTitle } from "../../utils/visaUtils";

/*
  ApplicationDetailSection

  This component displays one onboarding application in detail.

  It is used by HR in ApplicationDetailPage.

  It shows:
  - basic information
  - address
  - work authorization
  - emergency contact
  - uploaded documents

  Responsive:
  - Uses Row and Col.
  - On small screens, each field stacks vertically.
  - On larger screens, fields are shown in two columns.
*/
export default function ApplicationDetailSection({ application }) {
  if (!application) {
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
              <div>{application.firstName || "N/A"}</div>
            </Col>

            <Col xs={12} md={6}>
              <strong>Last Name:</strong>
              <div>{application.lastName || "N/A"}</div>
            </Col>

            <Col xs={12} md={6}>
              <strong>Middle Name:</strong>
              <div>{application.middleName || "N/A"}</div>
            </Col>

            <Col xs={12} md={6}>
              <strong>Preferred Name:</strong>
              <div>{application.preferredName || "N/A"}</div>
            </Col>

            <Col xs={12} md={6}>
              <strong>Email:</strong>
              <div>{application.email || "N/A"}</div>
            </Col>

            <Col xs={12} md={6}>
              <strong>Phone Number:</strong>
              <div>{application.phoneNumber || "N/A"}</div>
            </Col>

            <Col xs={12} md={6}>
              <strong>SSN:</strong>
              <div>{application.ssn || "N/A"}</div>
            </Col>

            <Col xs={12} md={6}>
              <strong>Date of Birth:</strong>
              <div>{formatDate(application.dateOfBirth)}</div>
            </Col>

            <Col xs={12} md={6}>
              <strong>Gender:</strong>
              <div>{application.gender || "N/A"}</div>
            </Col>

            <Col xs={12} md={6}>
              <strong>Application Status:</strong>
              <div>
                <StatusBadge status={application.status} />
              </div>
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
              <div>{application.address?.street || "N/A"}</div>
            </Col>

            <Col xs={12} md={4}>
              <strong>City:</strong>
              <div>{application.address?.city || "N/A"}</div>
            </Col>

            <Col xs={12} md={4}>
              <strong>State:</strong>
              <div>{application.address?.state || "N/A"}</div>
            </Col>

            <Col xs={12} md={4}>
              <strong>Zip Code:</strong>
              <div>{application.address?.zipCode || "N/A"}</div>
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
                  application.workAuthorization?.title,
                  application.workAuthorization?.otherTitle
                )}
              </div>
            </Col>

            <Col xs={12} md={6}>
              <strong>Start Date:</strong>
              <div>{formatDate(application.workAuthorization?.startDate)}</div>
            </Col>

            <Col xs={12} md={6}>
              <strong>End Date:</strong>
              <div>{formatDate(application.workAuthorization?.endDate)}</div>
            </Col>

            <Col xs={12} md={6}>
              <strong>Need Visa Management:</strong>
              <div>
                {application.workAuthorization?.title === "f1_cpt_opt"
                  ? "Yes"
                  : "No"}
              </div>
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
              <div>{application.emergencyContact?.firstName || "N/A"}</div>
            </Col>

            <Col xs={12} md={6}>
              <strong>Last Name:</strong>
              <div>{application.emergencyContact?.lastName || "N/A"}</div>
            </Col>

            <Col xs={12} md={6}>
              <strong>Middle Name:</strong>
              <div>{application.emergencyContact?.middleName || "N/A"}</div>
            </Col>

            <Col xs={12} md={6}>
              <strong>Phone Number:</strong>
              <div>{application.emergencyContact?.phoneNumber || "N/A"}</div>
            </Col>

            <Col xs={12} md={6}>
              <strong>Email:</strong>
              <div>{application.emergencyContact?.email || "N/A"}</div>
            </Col>

            <Col xs={12} md={6}>
              <strong>Relationship:</strong>
              <div>{application.emergencyContact?.relationship || "N/A"}</div>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Documents */}
      <Card className="mb-3">
        <Card.Body>
          <Card.Title>Uploaded Documents</Card.Title>

          <Row className="g-3">
            <Col xs={12} md={6}>
              <strong>Driver License:</strong>
              <div className="mt-2">
                <DocumentActions document={application.driverLicense} />
              </div>
            </Col>

            <Col xs={12} md={6}>
              <strong>OPT Receipt:</strong>
              <div className="mt-2">
                <DocumentActions document={application.optReceipt} />
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Feedback */}
      {application.feedback && (
        <Card className="mb-3">
          <Card.Body>
            <Card.Title>HR Feedback</Card.Title>
            <p className="mb-0">{application.feedback}</p>
          </Card.Body>
        </Card>
      )}
    </div>
  );
}