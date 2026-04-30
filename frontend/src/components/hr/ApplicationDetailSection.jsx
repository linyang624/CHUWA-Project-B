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
    <div
      style={{
        fontFamily:
          "Arial, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >
      {/* Basic Information */}
      <SectionCard title="Basic Information">
        {/* Avatar preview in Basic Information */}
        <div className="d-flex flex-column flex-sm-row align-items-sm-center gap-3 mb-4">
          <img
            src={profilePictureUrl}
            alt="Profile"
            style={{
              width: "96px",
              height: "96px",
              borderRadius: "50%",
              objectFit: "cover",
              border: "3px solid #eef2ff",
              boxShadow: "0 8px 18px rgba(15, 23, 42, 0.08)",
              flexShrink: 0,
            }}
          />

          <div style={{ minWidth: 0 }}>
            <div
              style={{
                color: "#1f2937",
                fontSize: "22px",
                fontWeight: "900",
                letterSpacing: "-0.04em",
                lineHeight: "1.2",
              }}
            >
              {application.firstName || ""} {application.lastName || ""}
            </div>

            <div
              className="text-truncate"
              style={{
                color: "#6b7280",
                fontSize: "14px",
                fontWeight: "600",
                marginTop: "4px",
                maxWidth: "360px",
              }}
            >
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
            <div
              style={{
                background: "#f8fafc",
                border: "1px solid #e5e7eb",
                borderRadius: "14px",
                padding: "12px 14px",
                minHeight: "76px",
              }}
            >
              <div
                style={{
                  color: "#6b7280",
                  fontSize: "12px",
                  fontWeight: "900",
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                  marginBottom: "8px",
                }}
              >
                Application Status
              </div>

              <div>
                <StatusBadge status={application.status} />
              </div>
            </div>
          </Col>
        </Row>
      </SectionCard>

      {/* Address */}
      <SectionCard title="Address">
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
      </SectionCard>

      {/* Work Authorization */}
      <SectionCard title="Work Authorization">
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
      </SectionCard>

      {/* Reference */}
      <SectionCard title="Reference">
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

            <InfoItem label="Phone">{reference.phone || "N/A"}</InfoItem>

            <InfoItem label="Email">{reference.email || "N/A"}</InfoItem>

            <InfoItem label="Relationship">
              {reference.relationship || "N/A"}
            </InfoItem>
          </Row>
        ) : (
          <EmptyText>No reference provided.</EmptyText>
        )}
      </SectionCard>

      {/* Emergency Contacts */}
      <SectionCard title="Emergency Contact">
        {emergencyContacts.length > 0 ? (
          emergencyContacts.map((contact, index) => (
            <Card
              key={index}
              className="mb-3 border-0"
              style={{
                borderRadius: "18px",
                background: "#f8fafc",
                boxShadow: "inset 0 0 0 1px #e5e7eb",
              }}
            >
              <Card.Body className="p-3 p-md-4">
                <h6
                  className="mb-3"
                  style={{
                    color: "#1f2937",
                    fontSize: "15px",
                    fontWeight: "900",
                    letterSpacing: "-0.02em",
                  }}
                >
                  Emergency Contact {index + 1}
                </h6>

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

                  <InfoItem label="Email">{contact.email || "N/A"}</InfoItem>

                  <InfoItem label="Relationship">
                    {contact.relationship || "N/A"}
                  </InfoItem>
                </Row>
              </Card.Body>
            </Card>
          ))
        ) : (
          <EmptyText>No emergency contact found.</EmptyText>
        )}
      </SectionCard>

      {/* Documents */}
      <SectionCard title="Uploaded Documents">
        <Row className="g-3">
          <Col xs={12} md={6}>
            <DocumentBlock title="Profile Picture">
              <DocumentActions
                document={application.profilePicture}
                showPreview={true}
                showDownload={true}
              />
            </DocumentBlock>
          </Col>

          <Col xs={12} md={6}>
            <DocumentBlock title="Driver License">
              <DocumentActions
                document={application.driverLicense}
                showPreview={true}
                showDownload={true}
              />
            </DocumentBlock>
          </Col>

          <Col xs={12} md={6}>
            <DocumentBlock
              title={
                application.workAuthorization?.visaTitle === "f1_cpt_opt"
                  ? "OPT Receipt"
                  : "Work Authorization Document"
              }
            >
              <DocumentActions
                document={
                  application.workAuthorization?.optReceipt ||
                  application.optReceipt
                }
                showPreview={true}
                showDownload={true}
              />
            </DocumentBlock>
          </Col>
        </Row>
      </SectionCard>

      {/* Feedback */}
      {application.feedback && (
        <SectionCard title="HR Feedback">
          <div
            style={{
              background: "#fffbeb",
              border: "1px solid #fde68a",
              borderRadius: "16px",
              padding: "14px 16px",
              color: "#92400e",
              fontSize: "14px",
              fontWeight: "600",
              lineHeight: "1.65",
            }}
          >
            {application.feedback}
          </div>
        </SectionCard>
      )}
    </div>
  );
}

function SectionCard({ title, children }) {
  return (
    <Card
      className="mb-4 border-0"
      style={{
        borderRadius: "20px",
        boxShadow: "0 10px 24px rgba(15, 23, 42, 0.05)",
        overflow: "hidden",
      }}
    >
      <Card.Body className="p-4">
        <Card.Title
          className="mb-4"
          style={{
            color: "#1f2937",
            fontSize: "22px",
            fontWeight: "900",
            letterSpacing: "-0.04em",
          }}
        >
          {title}
        </Card.Title>

        {children}
      </Card.Body>
    </Card>
  );
}

function InfoItem({ label, children }) {
  return (
    <Col xs={12} md={6}>
      <div
        style={{
          background: "#f8fafc",
          border: "1px solid #e5e7eb",
          borderRadius: "14px",
          padding: "12px 14px",
          minHeight: "76px",
        }}
      >
        <div
          style={{
            color: "#6b7280",
            fontSize: "12px",
            fontWeight: "900",
            textTransform: "uppercase",
            letterSpacing: "0.04em",
            marginBottom: "5px",
          }}
        >
          {label}
        </div>

        <div
          style={{
            color: "#1f2937",
            fontSize: "14px",
            fontWeight: "700",
            lineHeight: "1.45",
            wordBreak: "break-word",
          }}
        >
          {children}
        </div>
      </div>
    </Col>
  );
}

function DocumentBlock({ title, children }) {
  return (
    <div
      style={{
        background: "#f8fafc",
        border: "1px solid #e5e7eb",
        borderRadius: "16px",
        padding: "14px",
        height: "100%",
      }}
    >
      <div
        className="mb-2"
        style={{
          color: "#374151",
          fontSize: "14px",
          fontWeight: "900",
        }}
      >
        {title}
      </div>

      {children}
    </div>
  );
}

function EmptyText({ children }) {
  return (
    <p
      className="mb-0"
      style={{
        color: "#6b7280",
        fontSize: "14px",
        fontWeight: "600",
      }}
    >
      {children}
    </p>
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