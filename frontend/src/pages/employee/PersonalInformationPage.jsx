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
        <p style={{ color: "red" }}>{error}</p>
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
      <h1 className="mb-4">Personal Information</h1>

      {/* Name */}
      <Card className="mb-3">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-start mb-3">
            <Card.Title className="mb-0">Name</Card.Title>

            {editingSection !== "name" && (
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
              >
                Edit
              </Button>
            )}
          </div>

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
                border: "1px solid #ddd",
              }}
            />

            <div className="flex-grow-1">
              <div className="fw-semibold">
                {profile.firstName || ""} {profile.lastName || ""}
              </div>

              <div className="text-muted small mb-2">
                {profile.email || "N/A"}
              </div>

              {/* Only show profile picture upload after clicking Edit */}
              {editingSection === "name" && (
                <>
                  <Form.Group className="mb-2">
                    <Form.Label className="small mb-1">
                      Change Profile Picture
                    </Form.Label>

                    <Form.Control
                      type="file"
                      accept="image/*"
                      onChange={handleProfilePictureChange}
                    />
                  </Form.Group>

                  <Button
                    size="sm"
                    variant="outline-primary"
                    onClick={handleUploadProfilePicture}
                    disabled={!profilePictureFile}
                  >
                    Upload New Picture
                  </Button>
                </>
              )}
            </div>
          </div>

          {editingSection === "name" ? (
            <>
              <Row className="g-3">
                <Col xs={12} md={6}>
                  <Form.Group>
                    <Form.Label>First Name</Form.Label>
                    <Form.Control
                      value={draft.firstName || ""}
                      onChange={(e) =>
                        setDraft({ ...draft, firstName: e.target.value })
                      }
                    />
                  </Form.Group>
                </Col>

                <Col xs={12} md={6}>
                  <Form.Group>
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control
                      value={draft.lastName || ""}
                      onChange={(e) =>
                        setDraft({ ...draft, lastName: e.target.value })
                      }
                    />
                  </Form.Group>
                </Col>

                <Col xs={12} md={6}>
                  <Form.Group>
                    <Form.Label>Middle Name</Form.Label>
                    <Form.Control
                      value={draft.middleName || ""}
                      onChange={(e) =>
                        setDraft({ ...draft, middleName: e.target.value })
                      }
                    />
                  </Form.Group>
                </Col>

                <Col xs={12} md={6}>
                  <Form.Group>
                    <Form.Label>Preferred Name</Form.Label>
                    <Form.Control
                      value={draft.preferredName || ""}
                      onChange={(e) =>
                        setDraft({ ...draft, preferredName: e.target.value })
                      }
                    />
                  </Form.Group>
                </Col>

                <Col xs={12} md={6}>
                  <Form.Group>
                    <Form.Label>Email</Form.Label>
                    <Form.Control value={profile.email || ""} disabled readOnly />
                  </Form.Group>
                </Col>

                <Col xs={12} md={6}>
                  <Form.Group>
                    <Form.Label>Gender</Form.Label>
                    <Form.Select
                      value={draft.gender || ""}
                      onChange={(e) =>
                        setDraft({ ...draft, gender: e.target.value })
                      }
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
        </Card.Body>
      </Card>

      {/* Address */}
      <Card className="mb-3">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-start mb-3">
            <Card.Title className="mb-0">Address</Card.Title>

            {editingSection !== "address" && (
              <Button
                size="sm"
                variant="outline-primary"
                onClick={() =>
                  startEdit("address", {
                    address: profile.address,
                  })
                }
              >
                Edit
              </Button>
            )}
          </div>

          {editingSection === "address" ? (
            <>
              <Row className="g-3">
                <Col xs={12} md={6}>
                  <Form.Group>
                    <Form.Label>Street</Form.Label>
                    <Form.Control
                      value={draft.address?.street || ""}
                      onChange={(e) =>
                        setDraft({
                          address: { ...draft.address, street: e.target.value },
                        })
                      }
                    />
                  </Form.Group>
                </Col>

                <Col xs={12} md={6}>
                  <Form.Group>
                    <Form.Label>Building / Apt</Form.Label>
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
                    />
                  </Form.Group>
                </Col>

                <Col xs={12} md={4}>
                  <Form.Group>
                    <Form.Label>City</Form.Label>
                    <Form.Control
                      value={draft.address?.city || ""}
                      onChange={(e) =>
                        setDraft({
                          address: { ...draft.address, city: e.target.value },
                        })
                      }
                    />
                  </Form.Group>
                </Col>

                <Col xs={12} md={4}>
                  <Form.Group>
                    <Form.Label>State</Form.Label>
                    <Form.Control
                      value={draft.address?.state || ""}
                      onChange={(e) =>
                        setDraft({
                          address: { ...draft.address, state: e.target.value },
                        })
                      }
                    />
                  </Form.Group>
                </Col>

                <Col xs={12} md={4}>
                  <Form.Group>
                    <Form.Label>Zip</Form.Label>
                    <Form.Control
                      value={draft.address?.zip || ""}
                      onChange={(e) =>
                        setDraft({
                          address: { ...draft.address, zip: e.target.value },
                        })
                      }
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
        </Card.Body>
      </Card>

      {/* Contact */}
      <Card className="mb-3">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-start mb-3">
            <Card.Title className="mb-0">Contact Info</Card.Title>

            {editingSection !== "contact" && (
              <Button
                size="sm"
                variant="outline-primary"
                onClick={() =>
                  startEdit("contact", {
                    cellPhone: profile.cellPhone,
                    workPhone: profile.workPhone,
                  })
                }
              >
                Edit
              </Button>
            )}
          </div>

          {editingSection === "contact" ? (
            <>
              <Row className="g-3">
                <Col xs={12} md={6}>
                  <Form.Group>
                    <Form.Label>Cell Phone</Form.Label>
                    <Form.Control
                      value={draft.cellPhone || ""}
                      onChange={(e) =>
                        setDraft({ ...draft, cellPhone: e.target.value })
                      }
                    />
                  </Form.Group>
                </Col>

                <Col xs={12} md={6}>
                  <Form.Group>
                    <Form.Label>Work Phone</Form.Label>
                    <Form.Control
                      value={draft.workPhone || ""}
                      onChange={(e) =>
                        setDraft({ ...draft, workPhone: e.target.value })
                      }
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
        </Card.Body>
      </Card>

      {/* Employment */}
      <Card className="mb-3">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-start mb-3">
            <Card.Title className="mb-0">Employment</Card.Title>

            {editingSection !== "employment" && (
              <Button
                size="sm"
                variant="outline-primary"
                onClick={() =>
                  startEdit("employment", {
                    workAuthorization: profile.workAuthorization || {},
                  })
                }
              >
                Edit
              </Button>
            )}
          </div>

          {editingSection === "employment" ? (
            <>
              <Row className="g-3">
                <Col xs={12} md={4}>
                  <Form.Group>
                    <Form.Label>Visa Title</Form.Label>
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
                    />
                  </Form.Group>
                </Col>

                <Col xs={12} md={4}>
                  <Form.Group>
                    <Form.Label>Start Date</Form.Label>
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
                    />
                  </Form.Group>
                </Col>

                <Col xs={12} md={4}>
                  <Form.Group>
                    <Form.Label>End Date</Form.Label>
                    <Form.Control
                      type="date"
                      value={
                        draft.workAuthorization?.endDate?.slice(0, 10) || ""
                      }
                      onChange={(e) =>
                        setDraft({
                          ...draft,
                          workAuthorization: {
                            ...draft.workAuthorization,
                            endDate: e.target.value,
                          },
                        })
                      }
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
        </Card.Body>
      </Card>

      {/* Emergency Contact */}
      <Card className="mb-3">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-start mb-3">
            <Card.Title className="mb-0">Emergency Contact</Card.Title>

            {editingSection !== "emergency" && (
              <Button
                size="sm"
                variant="outline-primary"
                onClick={() =>
                  startEdit("emergency", {
                    emergencyContacts: profile.emergencyContacts || [{}],
                  })
                }
              >
                Edit
              </Button>
            )}
          </div>

          {editingSection === "emergency" ? (
            <>
              <Row className="g-3">
                <Col xs={12} md={6}>
                  <Form.Group>
                    <Form.Label>First Name</Form.Label>
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
                    />
                  </Form.Group>
                </Col>

                <Col xs={12} md={6}>
                  <Form.Group>
                    <Form.Label>Last Name</Form.Label>
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
                    />
                  </Form.Group>
                </Col>

                <Col xs={12} md={6}>
                  <Form.Group>
                    <Form.Label>Phone</Form.Label>
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
                    />
                  </Form.Group>
                </Col>

                <Col xs={12} md={6}>
                  <Form.Group>
                    <Form.Label>Email</Form.Label>
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
                    />
                  </Form.Group>
                </Col>

                <Col xs={12} md={6}>
                  <Form.Group>
                    <Form.Label>Relationship</Form.Label>
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
        </Card.Body>
      </Card>

      {/* Uploaded Documents */}
      <Card className="mb-3">
        <Card.Body>
          <Card.Title className="mb-3">Uploaded Documents</Card.Title>

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
                <p className="mb-0">
                  No work authorization document required for Citizen / Green
                  Card.
                </p>
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
        </Card.Body>
      </Card>
    </Layout>
  );
}

function InfoItem({ label, children }) {
  return (
    <Col xs={12} md={6} lg={4}>
      <div>
        <strong>{label}:</strong>
      </div>
      <div>{children}</div>
    </Col>
  );
}

function ActionButtons({ onSave, onCancel }) {
  return (
    <Stack direction="horizontal" gap={2} className="mt-3">
      <Button size="sm" variant="primary" onClick={onSave}>
        Save
      </Button>

      <Button size="sm" variant="outline-secondary" onClick={onCancel}>
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