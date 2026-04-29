import { Card, Col, Row } from "react-bootstrap";

import DocumentActions from "../common/DocumentActions";
import { formatDate } from "../../utils/formatDate";
import { formatVisaTitle } from "../../utils/visaUtils";

const DEFAULT_AVATAR_URL = "http://localhost:5001/uploads/default_photo.jpg";

/*
  EmployeeProfileDetail

  Used by HR to view one approved employee's full profile.

  This detail is created from approved onboarding application data.

  Important:
  The backend returns the approved OnboardingApplication.
  So the field names should match employee-side profile data:
  - cellPhone / workPhone
  - emergencyContacts
  - workAuthorization.visaTitle
  - workAuthorization.optReceipt
  - address.zip

  Profile picture:
  - Basic Information shows the avatar image.
  - Documents still keeps Profile Picture preview/download actions.
*/
export default function EmployeeProfileDetail({ employee }) {
  if (!employee) {
    return null;
  }

  const emergencyContacts = employee.emergencyContacts || [];
  const profilePictureUrl =
    getDocumentUrl(employee.profilePicture) || DEFAULT_AVATAR_URL;

  return (
    <div>
      {/* Basic Information */}
      <Card className="mb-3">
        <Card.Body>
          <Card.Title>Basic Information</Card.Title>

          {/* Avatar preview in Basic Information */}
          <div className="d-flex align-items-center gap-3 mb-4">
            <img
              src={profilePictureUrl}
              alt="Profile"
              style={{
                width: "96px",
                height: "96px",
                borderRadius: "50%",
                objectFit: "cover",
                border: "1px solid #ddd",
              }}
            />

            <div>
              <div className="fw-semibold">
                {employee.firstName || ""} {employee.lastName || ""}
              </div>
              <div className="text-muted small">
                {employee.user?.email || employee.email || "N/A"}
              </div>
            </div>
          </div>

          <Row className="g-3">
            <InfoItem label="First Name">
              {employee.firstName || "N/A"}
            </InfoItem>

            <InfoItem label="Last Name">
              {employee.lastName || "N/A"}
            </InfoItem>

            <InfoItem label="Middle Name">
              {employee.middleName || "N/A"}
            </InfoItem>

            <InfoItem label="Preferred Name">
              {employee.preferredName || "N/A"}
            </InfoItem>

            <InfoItem label="Email">
              {employee.user?.email || employee.email || "N/A"}
            </InfoItem>

            <InfoItem label="Cell Phone">
              {employee.cellPhone || "N/A"}
            </InfoItem>

            <InfoItem label="Work Phone">
              {employee.workPhone || "N/A"}
            </InfoItem>

            <InfoItem label="SSN">{employee.ssn || "N/A"}</InfoItem>

            <InfoItem label="Date of Birth">
              {formatDate(employee.dateOfBirth)}
            </InfoItem>

            <InfoItem label="Gender">
              {formatGender(employee.gender)}
            </InfoItem>
          </Row>
        </Card.Body>
      </Card>

      {/* Address */}
      <Card className="mb-3">
        <Card.Body>
          <Card.Title>Address</Card.Title>

          <Row className="g-3">
            <InfoItem label="Street Address">
              {employee.address?.street || "N/A"}
            </InfoItem>

            <InfoItem label="Building / Apt">
              {employee.address?.building || "N/A"}
            </InfoItem>

            <InfoItem label="City">
              {employee.address?.city || "N/A"}
            </InfoItem>

            <InfoItem label="State">
              {employee.address?.state || "N/A"}
            </InfoItem>

            <InfoItem label="Zip">
              {employee.address?.zip || employee.address?.zipCode || "N/A"}
            </InfoItem>
          </Row>
        </Card.Body>
      </Card>

      {/* Work Authorization */}
      <Card className="mb-3">
        <Card.Body>
          <Card.Title>Work Authorization</Card.Title>

          <Row className="g-3">
            <InfoItem label="Permanent Resident / Citizen">
              {employee.isPermanentResidentOrCitizen ? "Yes" : "No"}
            </InfoItem>

            {employee.isPermanentResidentOrCitizen && (
              <InfoItem label="Resident Type">
                {formatResidentType(employee.residentType)}
              </InfoItem>
            )}

            {!employee.isPermanentResidentOrCitizen && (
              <>
                <InfoItem label="Work Authorization Title">
                  {formatVisaTitle(
                    employee.workAuthorization?.visaTitle ||
                      employee.workAuthorization?.title ||
                      employee.workAuthorizationTitle,
                    employee.workAuthorization?.otherTitle
                  )}
                </InfoItem>

                <InfoItem label="Start Date">
                  {formatDate(employee.workAuthorization?.startDate)}
                </InfoItem>

                <InfoItem label="End Date">
                  {formatDate(employee.workAuthorization?.endDate)}
                </InfoItem>

                <InfoItem label="Need Visa Management">
                  {employee.workAuthorization?.visaTitle === "f1_cpt_opt" ||
                  employee.workAuthorization?.title === "f1_cpt_opt"
                    ? "Yes"
                    : "No"}
                </InfoItem>
              </>
            )}
          </Row>
        </Card.Body>
      </Card>

      {/* Emergency Contacts */}
      <Card className="mb-3">
        <Card.Body>
          <Card.Title>Emergency Contact</Card.Title>

          {emergencyContacts.length > 0 ? (
            emergencyContacts.map((contact, index) => (
              <Card key={index} className="mb-3 border">
                <Card.Body>
                  <h6 className="mb-3">Emergency Contact {index + 1}</h6>

                  <Row className="g-3">
                    <InfoItem label="First Name">
                      {contact.firstName || "N/A"}
                    </InfoItem>

                    <InfoItem label="Last Name">
                      {contact.lastName || "N/A"}
                    </InfoItem>

                    <InfoItem label="Middle Name">
                      {contact.middleName || "N/A"}
                    </InfoItem>

                    <InfoItem label="Phone">
                      {contact.phone || contact.phoneNumber || "N/A"}
                    </InfoItem>

                    <InfoItem label="Email">
                      {contact.email || "N/A"}
                    </InfoItem>

                    <InfoItem label="Relationship">
                      {contact.relationship || "N/A"}
                    </InfoItem>
                  </Row>
                </Card.Body>
              </Card>
            ))
          ) : (
            <p className="mb-0 text-muted">No emergency contact found.</p>
          )}
        </Card.Body>
      </Card>

      {/* Documents */}
      <Card className="mb-3">
        <Card.Body>
          <Card.Title>Documents</Card.Title>

          <Row className="g-3">
            <Col xs={12} md={6}>
              <strong>Profile Picture:</strong>
              <div className="mt-2">
                <DocumentActions
                  document={employee.profilePicture}
                  showPreview={true}
                  showDownload={true}
                />
              </div>
            </Col>

            <Col xs={12} md={6}>
              <strong>Driver License:</strong>
              <div className="mt-2">
                <DocumentActions
                  document={employee.driverLicense}
                  showPreview={true}
                  showDownload={true}
                />
              </div>
            </Col>

            <Col xs={12} md={6}>
              <strong>
                {employee.workAuthorization?.visaTitle === "f1_cpt_opt"
                  ? "OPT Receipt:"
                  : "Work Authorization Document:"}
              </strong>

              <div className="mt-2">
                <DocumentActions
                  document={employee.workAuthorization?.optReceipt}
                  showPreview={true}
                  showDownload={true}
                />
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </div>
  );
}

function InfoItem({ label, children }) {
  return (
    <Col xs={12} md={6}>
      <strong>{label}:</strong>
      <div>{children}</div>
    </Col>
  );
}

function getDocumentUrl(document) {
  if (!document) {
    return "";
  }

  if (document.fileName) {
    return `http://localhost:5001/uploads/${document.fileName}`;
  }

  if (document.filePath) {
    const normalizedPath = document.filePath.replace(/\\/g, "/");
    const fileName = normalizedPath.split("/").pop();

    return `http://localhost:5001/uploads/${fileName}`;
  }

  return "";
}

function formatGender(gender) {
  const map = {
    male: "Male",
    female: "Female",
    i_do_not_wish_to_answer: "I do not wish to answer",
  };

  return map[gender] || "N/A";
}

function formatResidentType(type) {
  const map = {
    green_card: "Green Card",
    citizen: "Citizen",
  };

  return map[type] || "N/A";
}