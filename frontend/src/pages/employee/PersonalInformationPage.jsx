import { useEffect, useState } from "react";
import { Button, Card, Col, Form, Row, Stack } from "react-bootstrap";

import {
  getMyProfile,
  updateProfileSection,
  updateProfilePicture,
} from "../../api/profileApi";
import DocumentItem from "../../components/profile/DocumentItem";
import Layout from "../../components/common/Layout";
import Loading from "../../components/common/Loading";

const DEFAULT_AVATAR_URL = "http://localhost:5001/uploads/default_photo.jpg";

/*
  PersonalInformationPage

  Employee uses this page to view and edit their approved profile.

  Main rules:
  - Basic information always shows profile avatar.
  - Profile picture upload is only shown after clicking Edit in the Name section.
  - Uploaded Documents still keeps Profile Picture as a document item.
  - Default avatar is shown if employee has not uploaded a profile picture.
*/
export default function PersonalInformationPage() {
  const [profile, setProfile] = useState(null);
  const [editingSection, setEditingSection] = useState(null);
  const [draft, setDraft] = useState({});
  const [error, setError] = useState("");

  const [profilePictureFile, setProfilePictureFile] = useState(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await getMyProfile();
        setProfile(data);

        setProfilePicturePreview(
          getDocumentUrl(data.profilePicture) || DEFAULT_AVATAR_URL
        );
      } catch (err) {
        setError(err.message);
      }
    };

    loadProfile();
  }, []);

  /*
    Start editing one section.

    If user starts editing Name section, profile picture upload
    also becomes available because profile picture belongs to basic info.
  */
  const startEdit = (section, initialData) => {
    setEditingSection(section);
    setDraft(initialData);

    if (section === "name") {
      setProfilePictureFile(null);
      setProfilePicturePreview(
        getDocumentUrl(profile.profilePicture) || DEFAULT_AVATAR_URL
      );
    }
  };

  /*
    Cancel editing.

    Also reset profile picture preview if user was editing Name section.
  */
  const cancelEdit = () => {
    const confirmCancel = window.confirm("Discard all changes?");

    if (confirmCancel) {
      setEditingSection(null);
      setDraft({});
      setProfilePictureFile(null);

      if (profile) {
        setProfilePicturePreview(
          getDocumentUrl(profile.profilePicture) || DEFAULT_AVATAR_URL
        );
      }
    }
  };

  /*
    Save normal text fields for one section.
  */
  const saveSection = async (section) => {
    try {
      const updated = await updateProfileSection(section, draft);

      setProfile(updated);
      setEditingSection(null);
      setDraft({});
      setProfilePictureFile(null);

      setProfilePicturePreview(
        getDocumentUrl(updated.profilePicture) || DEFAULT_AVATAR_URL
      );
    } catch (err) {
      alert(err.message);
    }
  };

  /*
    When employee selects a new profile picture,
    show local preview immediately.
  */
  const handleProfilePictureChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      setProfilePictureFile(null);
      setProfilePicturePreview(
        getDocumentUrl(profile.profilePicture) || DEFAULT_AVATAR_URL
      );
      return;
    }

    setProfilePictureFile(file);
    setProfilePicturePreview(URL.createObjectURL(file));
  };

  /*
    Upload selected profile picture to backend.

    This is separate from saveSection because image upload uses FormData,
    while normal profile sections use JSON.
  */
  const handleUploadProfilePicture = async () => {
    if (!profilePictureFile) {
      alert("Please select a profile picture first.");
      return;
    }

    try {
      const updated = await updateProfilePicture(profilePictureFile);

      setProfile(updated);
      setProfilePictureFile(null);

      setProfilePicturePreview(
        getDocumentUrl(updated.profilePicture) || DEFAULT_AVATAR_URL
      );

      alert("Profile picture updated successfully.");
    } catch (err) {
      alert(err.message);
    }
  };

  if (error) {
    return (
      <Layout>
        <div
          style={{
            background: "#fef2f2",
            border: "1px solid #fecaca",
            color: "#991b1b",
            borderRadius: "16px",
            padding: "16px 18px",
            fontSize: "14px",
            fontWeight: "700",
            boxShadow: "0 10px 24px rgba(15, 23, 42, 0.05)",
          }}
        >
          {error}
        </div>
      </Layout>
    );
  }

  if (!profile) {
    return (
      <Layout>
        <Loading text="Loading profile..." />
      </Layout>
    );
  }

  const profilePictureUrl =
    profilePicturePreview ||
    getDocumentUrl(profile.profilePicture) ||
    DEFAULT_AVATAR_URL;

  return (
    <Layout>
      <PageHeader title="Personal Information" />

      {/* Name */}
      <SectionCard
        title="Name"
        action={
          editingSection !== "name" && (
            <Button
              size="sm"
              variant="outline-primary"
              onClick={() =>
                startEdit("name", {
                  firstName: profile.firstName,
                  lastName: profile.lastName,
                  middleName: profile.middleName,
                  preferredName: profile.preferredName,
                  gender: profile.gender,
                })
              }
              className="fw-bold px-3 text-nowrap"
              style={{ fontSize: "12px" }}
            >
              Edit
            </Button>
          )
        }
      >
        {/* Avatar preview */}
        <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center gap-3 mb-4">
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

          <div className="flex-grow-1" style={{ minWidth: 0 }}>
            <div
              style={{
                color: "#1f2937",
                fontSize: "22px",
                fontWeight: "900",
                letterSpacing: "-0.04em",
                lineHeight: "1.2",
              }}
            >
              {profile.firstName || ""} {profile.lastName || ""}
            </div>

            <div
              className="text-truncate mb-2"
              style={{
                color: "#6b7280",
                fontSize: "14px",
                fontWeight: "600",
                maxWidth: "360px",
              }}
            >
              {profile.email || "N/A"}
            </div>

            {/* Only show profile picture upload after clicking Edit */}
            {editingSection === "name" && (
              <div
                style={{
                  background: "#f8fafc",
                  border: "1px solid #e5e7eb",
                  borderRadius: "16px",
                  padding: "14px",
                  marginTop: "10px",
                }}
              >
                <Form.Group className="mb-2">
                  <Form.Label style={labelStyle}>
                    Change Profile Picture
                  </Form.Label>

                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePictureChange}
                    style={fileInputStyle}
                  />
                </Form.Group>

                <Button
                  size="sm"
                  variant="outline-primary"
                  onClick={handleUploadProfilePicture}
                  disabled={!profilePictureFile}
                  className="fw-bold px-3"
                  style={{ fontSize: "12px" }}
                >
                  Upload New Picture
                </Button>
              </div>
            )}
          </div>
        </div>

        {editingSection === "name" ? (
          <>
            <Row className="g-3">
              <Col xs={12} md={6}>
                <Form.Group>
                  <Form.Label style={labelStyle}>First Name</Form.Label>
                  <Form.Control
                    value={draft.firstName || ""}
                    onChange={(e) =>
                      setDraft({ ...draft, firstName: e.target.value })
                    }
                    style={inputStyle}
                  />
                </Form.Group>
              </Col>

              <Col xs={12} md={6}>
                <Form.Group>
                  <Form.Label style={labelStyle}>Last Name</Form.Label>
                  <Form.Control
                    value={draft.lastName || ""}
                    onChange={(e) =>
                      setDraft({ ...draft, lastName: e.target.value })
                    }
                    style={inputStyle}
                  />
                </Form.Group>
              </Col>

              <Col xs={12} md={6}>
                <Form.Group>
                  <Form.Label style={labelStyle}>Middle Name</Form.Label>
                  <Form.Control
                    value={draft.middleName || ""}
                    onChange={(e) =>
                      setDraft({ ...draft, middleName: e.target.value })
                    }
                    style={inputStyle}
                  />
                </Form.Group>
              </Col>

              <Col xs={12} md={6}>
                <Form.Group>
                  <Form.Label style={labelStyle}>Preferred Name</Form.Label>
                  <Form.Control
                    value={draft.preferredName || ""}
                    onChange={(e) =>
                      setDraft({ ...draft, preferredName: e.target.value })
                    }
                    style={inputStyle}
                  />
                </Form.Group>
              </Col>

              <Col xs={12} md={6}>
                <Form.Group>
                  <Form.Label style={labelStyle}>Email</Form.Label>
                  <Form.Control
                    value={profile.email || ""}
                    disabled
                    readOnly
                    style={disabledInputStyle}
                  />
                </Form.Group>
              </Col>

              <Col xs={12} md={6}>
                <Form.Group>
                  <Form.Label style={labelStyle}>Gender</Form.Label>
                  <Form.Select
                    value={draft.gender || ""}
                    onChange={(e) =>
                      setDraft({ ...draft, gender: e.target.value })
                    }
                    style={inputStyle}
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="i_do_not_wish_to_answer">
                      I do not wish to answer
                    </option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <ActionButtons
              onSave={() => saveSection("name")}
              onCancel={cancelEdit}
            />
          </>
        ) : (
          <Row className="g-3">
            <InfoItem label="Legal Name">
              {profile.firstName} {profile.middleName} {profile.lastName}
            </InfoItem>

            <InfoItem label="Preferred Name">
              {profile.preferredName || "N/A"}
            </InfoItem>

            <InfoItem label="Email">{profile.email || "N/A"}</InfoItem>

            <InfoItem label="Gender">{formatGender(profile.gender)}</InfoItem>
          </Row>
        )}
      </SectionCard>

      {/* Address */}
      <SectionCard
        title="Address"
        action={
          editingSection !== "address" && (
            <Button
              size="sm"
              variant="outline-primary"
              onClick={() =>
                startEdit("address", {
                  address: profile.address,
                })
              }
              className="fw-bold px-3 text-nowrap"
              style={{ fontSize: "12px" }}
            >
              Edit
            </Button>
          )
        }
      >
        {editingSection === "address" ? (
          <>
            <Row className="g-3">
              <Col xs={12} md={6}>
                <Form.Group>
                  <Form.Label style={labelStyle}>Street</Form.Label>
                  <Form.Control
                    value={draft.address?.street || ""}
                    onChange={(e) =>
                      setDraft({
                        address: { ...draft.address, street: e.target.value },
                      })
                    }
                    style={inputStyle}
                  />
                </Form.Group>
              </Col>

              <Col xs={12} md={6}>
                <Form.Group>
                  <Form.Label style={labelStyle}>Building / Apt</Form.Label>
                  <Form.Control
                    value={draft.address?.building || ""}
                    onChange={(e) =>
                      setDraft({
                        address: {
                          ...draft.address,
                          building: e.target.value,
                        },
                      })
                    }
                    style={inputStyle}
                  />
                </Form.Group>
              </Col>

              <Col xs={12} md={4}>
                <Form.Group>
                  <Form.Label style={labelStyle}>City</Form.Label>
                  <Form.Control
                    value={draft.address?.city || ""}
                    onChange={(e) =>
                      setDraft({
                        address: { ...draft.address, city: e.target.value },
                      })
                    }
                    style={inputStyle}
                  />
                </Form.Group>
              </Col>

              <Col xs={12} md={4}>
                <Form.Group>
                  <Form.Label style={labelStyle}>State</Form.Label>
                  <Form.Control
                    value={draft.address?.state || ""}
                    onChange={(e) =>
                      setDraft({
                        address: { ...draft.address, state: e.target.value },
                      })
                    }
                    style={inputStyle}
                  />
                </Form.Group>
              </Col>

              <Col xs={12} md={4}>
                <Form.Group>
                  <Form.Label style={labelStyle}>Zip</Form.Label>
                  <Form.Control
                    value={draft.address?.zip || ""}
                    onChange={(e) =>
                      setDraft({
                        address: { ...draft.address, zip: e.target.value },
                      })
                    }
                    style={inputStyle}
                  />
                </Form.Group>
              </Col>
            </Row>

            <ActionButtons
              onSave={() => saveSection("address")}
              onCancel={cancelEdit}
            />
          </>
        ) : (
          <Row className="g-3">
            <InfoItem label="Street">
              {profile.address?.street || "N/A"}
            </InfoItem>

            <InfoItem label="Building / Apt">
              {profile.address?.building || "N/A"}
            </InfoItem>

            <InfoItem label="City">{profile.address?.city || "N/A"}</InfoItem>

            <InfoItem label="State">
              {profile.address?.state || "N/A"}
            </InfoItem>

            <InfoItem label="Zip">{profile.address?.zip || "N/A"}</InfoItem>
          </Row>
        )}
      </SectionCard>

      {/* Contact */}
      <SectionCard
        title="Contact Info"
        action={
          editingSection !== "contact" && (
            <Button
              size="sm"
              variant="outline-primary"
              onClick={() =>
                startEdit("contact", {
                  cellPhone: profile.cellPhone,
                  workPhone: profile.workPhone,
                })
              }
              className="fw-bold px-3 text-nowrap"
              style={{ fontSize: "12px" }}
            >
              Edit
            </Button>
          )
        }
      >
        {editingSection === "contact" ? (
          <>
            <Row className="g-3">
              <Col xs={12} md={6}>
                <Form.Group>
                  <Form.Label style={labelStyle}>Cell Phone</Form.Label>
                  <Form.Control
                    value={draft.cellPhone || ""}
                    onChange={(e) =>
                      setDraft({ ...draft, cellPhone: e.target.value })
                    }
                    style={inputStyle}
                  />
                </Form.Group>
              </Col>

              <Col xs={12} md={6}>
                <Form.Group>
                  <Form.Label style={labelStyle}>Work Phone</Form.Label>
                  <Form.Control
                    value={draft.workPhone || ""}
                    onChange={(e) =>
                      setDraft({ ...draft, workPhone: e.target.value })
                    }
                    style={inputStyle}
                  />
                </Form.Group>
              </Col>
            </Row>

            <ActionButtons
              onSave={() => saveSection("contact")}
              onCancel={cancelEdit}
            />
          </>
        ) : (
          <Row className="g-3">
            <InfoItem label="Cell Phone">
              {profile.cellPhone || "N/A"}
            </InfoItem>

            <InfoItem label="Work Phone">
              {profile.workPhone || "N/A"}
            </InfoItem>
          </Row>
        )}
      </SectionCard>

      {/* Employment */}
      <SectionCard
        title="Employment"
        action={
          editingSection !== "employment" && (
            <Button
              size="sm"
              variant="outline-primary"
              onClick={() =>
                startEdit("employment", {
                  workAuthorization: profile.workAuthorization || {},
                })
              }
              className="fw-bold px-3 text-nowrap"
              style={{ fontSize: "12px" }}
            >
              Edit
            </Button>
          )
        }
      >
        {editingSection === "employment" ? (
          <>
            <Row className="g-3">
              <Col xs={12} md={4}>
                <Form.Group>
                  <Form.Label style={labelStyle}>Visa Title</Form.Label>
                  <Form.Control
                    value={draft.workAuthorization?.visaTitle || ""}
                    onChange={(e) =>
                      setDraft({
                        ...draft,
                        workAuthorization: {
                          ...draft.workAuthorization,
                          visaTitle: e.target.value,
                        },
                      })
                    }
                    style={inputStyle}
                  />
                </Form.Group>
              </Col>

              <Col xs={12} md={4}>
                <Form.Group>
                  <Form.Label style={labelStyle}>Start Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={
                      draft.workAuthorization?.startDate?.slice(0, 10) || ""
                    }
                    onChange={(e) =>
                      setDraft({
                        ...draft,
                        workAuthorization: {
                          ...draft.workAuthorization,
                          startDate: e.target.value,
                        },
                      })
                    }
                    style={inputStyle}
                  />
                </Form.Group>
              </Col>

              <Col xs={12} md={4}>
                <Form.Group>
                  <Form.Label style={labelStyle}>End Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={draft.workAuthorization?.endDate?.slice(0, 10) || ""}
                    onChange={(e) =>
                      setDraft({
                        ...draft,
                        workAuthorization: {
                          ...draft.workAuthorization,
                          endDate: e.target.value,
                        },
                      })
                    }
                    style={inputStyle}
                  />
                </Form.Group>
              </Col>
            </Row>

            <ActionButtons
              onSave={() => saveSection("employment")}
              onCancel={cancelEdit}
            />
          </>
        ) : (
          <Row className="g-3">
            <InfoItem label="Visa Title">
              {formatVisaTitle(profile.workAuthorization?.visaTitle)}
            </InfoItem>

            <InfoItem label="Start Date">
              {profile.workAuthorization?.startDate
                ? profile.workAuthorization.startDate.slice(0, 10)
                : "N/A"}
            </InfoItem>

            <InfoItem label="End Date">
              {profile.workAuthorization?.endDate
                ? profile.workAuthorization.endDate.slice(0, 10)
                : "N/A"}
            </InfoItem>
          </Row>
        )}
      </SectionCard>

      {/* Emergency Contact */}
      <SectionCard
        title="Emergency Contact"
        action={
          editingSection !== "emergency" && (
            <Button
              size="sm"
              variant="outline-primary"
              onClick={() =>
                startEdit("emergency", {
                  emergencyContacts: profile.emergencyContacts || [{}],
                })
              }
              className="fw-bold px-3 text-nowrap"
              style={{ fontSize: "12px" }}
            >
              Edit
            </Button>
          )
        }
      >
        {editingSection === "emergency" ? (
          <>
            <Row className="g-3">
              <Col xs={12} md={6}>
                <Form.Group>
                  <Form.Label style={labelStyle}>First Name</Form.Label>
                  <Form.Control
                    value={draft.emergencyContacts?.[0]?.firstName || ""}
                    onChange={(e) =>
                      setDraft({
                        ...draft,
                        emergencyContacts: [
                          {
                            ...(draft.emergencyContacts?.[0] || {}),
                            firstName: e.target.value,
                          },
                        ],
                      })
                    }
                    style={inputStyle}
                  />
                </Form.Group>
              </Col>

              <Col xs={12} md={6}>
                <Form.Group>
                  <Form.Label style={labelStyle}>Last Name</Form.Label>
                  <Form.Control
                    value={draft.emergencyContacts?.[0]?.lastName || ""}
                    onChange={(e) =>
                      setDraft({
                        ...draft,
                        emergencyContacts: [
                          {
                            ...(draft.emergencyContacts?.[0] || {}),
                            lastName: e.target.value,
                          },
                        ],
                      })
                    }
                    style={inputStyle}
                  />
                </Form.Group>
              </Col>

              <Col xs={12} md={6}>
                <Form.Group>
                  <Form.Label style={labelStyle}>Phone</Form.Label>
                  <Form.Control
                    value={draft.emergencyContacts?.[0]?.phone || ""}
                    onChange={(e) =>
                      setDraft({
                        ...draft,
                        emergencyContacts: [
                          {
                            ...(draft.emergencyContacts?.[0] || {}),
                            phone: e.target.value,
                          },
                        ],
                      })
                    }
                    style={inputStyle}
                  />
                </Form.Group>
              </Col>

              <Col xs={12} md={6}>
                <Form.Group>
                  <Form.Label style={labelStyle}>Email</Form.Label>
                  <Form.Control
                    value={draft.emergencyContacts?.[0]?.email || ""}
                    onChange={(e) =>
                      setDraft({
                        ...draft,
                        emergencyContacts: [
                          {
                            ...(draft.emergencyContacts?.[0] || {}),
                            email: e.target.value,
                          },
                        ],
                      })
                    }
                    style={inputStyle}
                  />
                </Form.Group>
              </Col>

              <Col xs={12} md={6}>
                <Form.Group>
                  <Form.Label style={labelStyle}>Relationship</Form.Label>
                  <Form.Control
                    value={draft.emergencyContacts?.[0]?.relationship || ""}
                    onChange={(e) =>
                      setDraft({
                        ...draft,
                        emergencyContacts: [
                          {
                            ...(draft.emergencyContacts?.[0] || {}),
                            relationship: e.target.value,
                          },
                        ],
                      })
                    }
                    style={inputStyle}
                  />
                </Form.Group>
              </Col>
            </Row>

            <ActionButtons
              onSave={() => saveSection("emergency")}
              onCancel={cancelEdit}
            />
          </>
        ) : (
          <Row className="g-3">
            <InfoItem label="Name">
              {profile.emergencyContacts?.[0]?.firstName || "N/A"}{" "}
              {profile.emergencyContacts?.[0]?.lastName || ""}
            </InfoItem>

            <InfoItem label="Phone">
              {profile.emergencyContacts?.[0]?.phone || "N/A"}
            </InfoItem>

            <InfoItem label="Email">
              {profile.emergencyContacts?.[0]?.email || "N/A"}
            </InfoItem>

            <InfoItem label="Relationship">
              {profile.emergencyContacts?.[0]?.relationship || "N/A"}
            </InfoItem>
          </Row>
        )}
      </SectionCard>

      {/* Uploaded Documents */}
      <SectionCard title="Uploaded Documents">
        <Row className="g-3">
          <Col xs={12} md={6}>
            <DocumentItem
              title="Profile Picture"
              document={profile.profilePicture}
            />
          </Col>

          <Col xs={12} md={6}>
            <DocumentItem
              title="Driver License"
              document={profile.driverLicense}
            />
          </Col>

          <Col xs={12} md={6}>
            {profile.isPermanentResidentOrCitizen ? (
              <div
                style={{
                  background: "#f8fafc",
                  border: "1px solid #e5e7eb",
                  borderRadius: "16px",
                  padding: "14px",
                  color: "#6b7280",
                  fontSize: "14px",
                  fontWeight: "700",
                  lineHeight: "1.5",
                }}
              >
                No work authorization document required for Citizen / Green
                Card.
              </div>
            ) : (
              <DocumentItem
                title={
                  profile.workAuthorization?.visaTitle === "f1_cpt_opt"
                    ? "OPT Receipt"
                    : "Work Authorization Document"
                }
                document={profile.workAuthorization?.optReceipt}
              />
            )}
          </Col>
        </Row>
      </SectionCard>
    </Layout>
  );
}

function PageHeader({ title }) {
  return (
    <div className="mb-4">
      <h1
        className="mb-0"
        style={{
          color: "#1f2937",
          fontSize: "clamp(30px, 4vw, 42px)",
          fontWeight: "900",
          letterSpacing: "-0.055em",
          lineHeight: "1.08",
        }}
      >
        {title}
      </h1>
    </div>
  );
}

function SectionCard({ title, action, children }) {
  return (
    <Card
      className="mb-4 border-0"
      style={{
        borderRadius: "20px",
        boxShadow: "0 10px 24px rgba(15, 23, 42, 0.05)",
        overflow: "hidden",
        fontFamily:
          "Arial, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >
      <Card.Body className="p-4">
        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4">
          <Card.Title
            className="mb-0"
            style={{
              color: "#1f2937",
              fontSize: "22px",
              fontWeight: "900",
              letterSpacing: "-0.04em",
            }}
          >
            {title}
          </Card.Title>

          {action}
        </div>

        {children}
      </Card.Body>
    </Card>
  );
}

function InfoItem({ label, children }) {
  return (
    <Col xs={12} md={6} lg={4}>
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

function ActionButtons({ onSave, onCancel }) {
  return (
    <Stack direction="horizontal" gap={2} className="mt-4">
      <Button
        size="sm"
        variant="primary"
        onClick={onSave}
        className="fw-bold px-3"
        style={{ fontSize: "12px" }}
      >
        Save
      </Button>

      <Button
        size="sm"
        variant="outline-secondary"
        onClick={onCancel}
        className="fw-bold px-3"
        style={{ fontSize: "12px" }}
      >
        Cancel
      </Button>
    </Stack>
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

function formatVisaTitle(title) {
  const map = {
    h1b: "H1-B",
    l2: "L2",
    f1_cpt_opt: "F1 CPT/OPT",
    h4: "H4",
    other: "Other",
  };

  return map[title] || "N/A";
}

const labelStyle = {
  color: "#374151",
  fontSize: "14px",
  fontWeight: "800",
  marginBottom: "8px",
};

const inputStyle = {
  height: "48px",
  borderRadius: "14px",
  border: "1px solid #d8dee8",
  fontSize: "14px",
  fontWeight: "500",
  paddingLeft: "14px",
  boxShadow: "none",
};

const disabledInputStyle = {
  ...inputStyle,
  backgroundColor: "#eef2f7",
  color: "#4b5563",
};

const fileInputStyle = {
  borderRadius: "14px",
  border: "1px solid #d8dee8",
  fontSize: "14px",
  fontWeight: "500",
  padding: "10px 14px",
  boxShadow: "none",
};