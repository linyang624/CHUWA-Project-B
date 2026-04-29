import { Card, Col, Row } from "react-bootstrap";

import DocumentActions from "../common/DocumentActions";
import StatusBadge from "../common/StatusBadge";
import { formatDate } from "../../utils/formatDate";
import { formatVisaTitle } from "../../utils/visaUtils";

const DEFAULT_AVATAR_URL = "http://localhost:5001/uploads/default_photo.jpg";

/*
  ApplicationDetailSection

  This component displays one onboarding application in detail.

  Important:
  Backend returns an OnboardingApplication.
  So field names should match employee-side onboarding data:
  - user.email
  - cellPhone / workPhone
  - address.zip
  - workAuthorization.visaTitle
  - workAuthorization.optReceipt
  - emergencyContacts array
  - reference object

  Profile picture:
  - Basic Information shows the avatar image.
  - Uploaded Documents still keeps Profile Picture preview/download actions.
*/
export default function ApplicationDetailSection({ application }) {
  if (!application) {
    return null;
  }

  const emergencyContacts = application.emergencyContacts || [];
  const reference = application.reference || {};

  const profilePictureUrl =
    getDocumentUrl(application.profilePicture) || DEFAULT_AVATAR_URL;

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
                {application.firstName || ""} {application.lastName || ""}
              </div>
              <div className="text-muted small">
                {application.user?.email || application.email || "N/A"}
              </div>
            </div>
          </div>

          <Row className="g-3">
            <InfoItem label="First Name">
              {application.firstName || "N/A"}
            </InfoItem>

            <InfoItem label="Last Name">
              {application.lastName || "N/A"}
            </InfoItem>

            <InfoItem label="Middle Name">
              {application.middleName || "N/A"}
            </InfoItem>

            <InfoItem label="Preferred Name">
              {application.preferredName || "N/A"}
            </InfoItem>

            <InfoItem label="Email">
              {application.user?.email || application.email || "N/A"}
            </InfoItem>

            <InfoItem label="Cell Phone">
              {application.cellPhone || "N/A"}
            </InfoItem>

            <InfoItem label="Work Phone">
              {application.workPhone || "N/A"}
            </InfoItem>

            <InfoItem label="SSN">{application.ssn || "N/A"}</InfoItem>

            <InfoItem label="Date of Birth">
              {formatDate(application.dateOfBirth)}
            </InfoItem>

            <InfoItem label="Gender">
              {formatGender(application.gender)}
            </InfoItem>

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
            <InfoItem label="Street Address">
              {application.address?.street || "N/A"}
            </InfoItem>

            <InfoItem label="Building / Apt">
              {application.address?.building || "N/A"}
            </InfoItem>

            <InfoItem label="City">
              {application.address?.city || "N/A"}
            </InfoItem>

            <InfoItem label="State">
              {application.address?.state || "N/A"}
            </InfoItem>

            <InfoItem label="Zip">
              {application.address?.zip || application.address?.zipCode || "N/A"}
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
              {application.isPermanentResidentOrCitizen ? "Yes" : "No"}
            </InfoItem>

            {application.isPermanentResidentOrCitizen && (
              <InfoItem label="Resident Type">
                {formatResidentType(application.residentType)}
              </InfoItem>
            )}

            {!application.isPermanentResidentOrCitizen && (
              <>
                <InfoItem label="Work Authorization Title">
                  {formatVisaTitle(
                    application.workAuthorization?.visaTitle ||
                      application.workAuthorization?.title,
                    application.workAuthorization?.otherTitle
                  )}
                </InfoItem>

                <InfoItem label="Start Date">
                  {formatDate(application.workAuthorization?.startDate)}
                </InfoItem>

                <InfoItem label="End Date">
                  {formatDate(application.workAuthorization?.endDate)}
                </InfoItem>

                <InfoItem label="Need Visa Management">
                  {application.workAuthorization?.visaTitle === "f1_cpt_opt" ||
                  application.workAuthorization?.title === "f1_cpt_opt"
                    ? "Yes"
                    : "No"}
                </InfoItem>
              </>
            )}
          </Row>
        </Card.Body>
      </Card>

      {/* Reference */}
      <Card className="mb-3">
        <Card.Body>
          <Card.Title>Reference</Card.Title>

          {hasReference(reference) ? (
            <Row className="g-3">
              <InfoItem label="First Name">
                {reference.firstName || "N/A"}
              </InfoItem>

              <InfoItem label="Last Name">
                {reference.lastName || "N/A"}
              </InfoItem>

              <InfoItem label="Middle Name">
                {reference.middleName || "N/A"}
              </InfoItem>

              <InfoItem label="Phone">
                {reference.phone || "N/A"}
              </InfoItem>

              <InfoItem label="Email">
                {reference.email || "N/A"}
              </InfoItem>

              <InfoItem label="Relationship">
                {reference.relationship || "N/A"}
              </InfoItem>
            </Row>
          ) : (
            <p className="mb-0 text-muted">No reference provided.</p>
          )}
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
          <Card.Title>Uploaded Documents</Card.Title>

          <Row className="g-3">
            <Col xs={12} md={6}>
              <strong>Profile Picture:</strong>
              <div className="mt-2">
                <DocumentActions
                  document={application.profilePicture}
                  showPreview={true}
                  showDownload={true}
                />
              </div>
            </Col>

            <Col xs={12} md={6}>
              <strong>Driver License:</strong>
              <div className="mt-2">
                <DocumentActions
                  document={application.driverLicense}
                  showPreview={true}
                  showDownload={true}
                />
              </div>
            </Col>

            <Col xs={12} md={6}>
              <strong>
                {application.workAuthorization?.visaTitle === "f1_cpt_opt"
                  ? "OPT Receipt:"
                  : "Work Authorization Document:"}
              </strong>

              <div className="mt-2">
                <DocumentActions
                  document={
                    application.workAuthorization?.optReceipt ||
                    application.optReceipt
                  }
                  showPreview={true}
                  showDownload={true}
                />
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

function hasReference(reference) {
  if (!reference) {
    return false;
  }

  return (
    reference.firstName ||
    reference.lastName ||
    reference.middleName ||
    reference.phone ||
    reference.email ||
    reference.relationship
  );
}