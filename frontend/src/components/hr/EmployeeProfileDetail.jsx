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
    <div
      style={{
        fontFamily:
          "Arial, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >
      {/* Basic Information */}
      <SectionCard title="Basic Information">
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
              border: "3px solid #eef2ff",
              boxShadow: "0 8px 18px rgba(15, 23, 42, 0.08)",
              flexShrink: 0,
            }}
          />

          <div style={{ minWidth: 0 }}>
            <div
              style={{
                color: "#1f2937",
                fontSize: "20px",
                fontWeight: "900",
                letterSpacing: "-0.04em",
              }}
            >
              {employee.firstName || ""} {employee.lastName || ""}
            </div>

            <div
              className="text-truncate"
              style={{
                color: "#6b7280",
                fontSize: "14px",
                fontWeight: "600",
                maxWidth: "320px",
              }}
            >
              {employee.user?.email || employee.email || "N/A"}
            </div>
          </div>
        </div>

        <Row className="g-3">
          <InfoItem label="First Name">{employee.firstName || "N/A"}</InfoItem>

          <InfoItem label="Last Name">{employee.lastName || "N/A"}</InfoItem>

          <InfoItem label="Middle Name">
            {employee.middleName || "N/A"}
          </InfoItem>

          <InfoItem label="Preferred Name">
            {employee.preferredName || "N/A"}
          </InfoItem>

          <InfoItem label="Email">
            {employee.user?.email || employee.email || "N/A"}
          </InfoItem>

          <InfoItem label="Cell Phone">{employee.cellPhone || "N/A"}</InfoItem>

          <InfoItem label="Work Phone">{employee.workPhone || "N/A"}</InfoItem>

          <InfoItem label="SSN">{employee.ssn || "N/A"}</InfoItem>

          <InfoItem label="Date of Birth">
            {formatDate(employee.dateOfBirth)}
          </InfoItem>

          <InfoItem label="Gender">{formatGender(employee.gender)}</InfoItem>
        </Row>
      </SectionCard>

      {/* Address */}
      <SectionCard title="Address">
        <Row className="g-3">
          <InfoItem label="Street Address">
            {employee.address?.street || "N/A"}
          </InfoItem>

          <InfoItem label="Building / Apt">
            {employee.address?.building || "N/A"}
          </InfoItem>

          <InfoItem label="City">{employee.address?.city || "N/A"}</InfoItem>

          <InfoItem label="State">{employee.address?.state || "N/A"}</InfoItem>

          <InfoItem label="Zip">
            {employee.address?.zip || employee.address?.zipCode || "N/A"}
          </InfoItem>
        </Row>
      </SectionCard>

      {/* Work Authorization */}
      <SectionCard title="Work Authorization">
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
          <p
            className="mb-0"
            style={{
              color: "#6b7280",
              fontSize: "14px",
              fontWeight: "600",
            }}
          >
            No emergency contact found.
          </p>
        )}
      </SectionCard>

      {/* Documents */}
      <SectionCard title="Documents">
        <Row className="g-3">
          <Col xs={12} md={6}>
            <DocumentBlock title="Profile Picture">
              <DocumentActions
                document={employee.profilePicture}
                showPreview={true}
                showDownload={true}
              />
            </DocumentBlock>
          </Col>

          <Col xs={12} md={6}>
            <DocumentBlock title="Driver License">
              <DocumentActions
                document={employee.driverLicense}
                showPreview={true}
                showDownload={true}
              />
            </DocumentBlock>
          </Col>

          <Col xs={12} md={6}>
            <DocumentBlock
              title={
                employee.workAuthorization?.visaTitle === "f1_cpt_opt"
                  ? "OPT Receipt"
                  : "Work Authorization Document"
              }
            >
              <DocumentActions
                document={employee.workAuthorization?.optReceipt}
                showPreview={true}
                showDownload={true}
              />
            </DocumentBlock>
          </Col>
        </Row>
      </SectionCard>
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