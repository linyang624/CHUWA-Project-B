import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { Alert, Button, Card, Col, Form, Row } from "react-bootstrap";

import { updateOnboardingStatus } from "../../features/auth/authSlice";
import {
  submitOnboardingApplication,
  getMyApplication,
} from "../../api/onboardingApi";
import Layout from "../../components/common/Layout";

const DEFAULT_AVATAR_URL = "http://localhost:5001/uploads/default_photo.jpg";

export default function OnboardingApplicationPage() {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  const [application, setApplication] = useState(null);
  const [profilePreview, setProfilePreview] = useState(DEFAULT_AVATAR_URL);

  const {
    register,
    handleSubmit,
    watch,
    control,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: user?.email || "",
      emergencyContacts: [
        {
          firstName: "",
          lastName: "",
          middleName: "",
          phone: "",
          email: "",
          relationship: "",
        },
      ],
    },
  });

  const {
    fields: emergencyFields,
    append: appendEmergencyContact,
    remove: removeEmergencyContact,
  } = useFieldArray({
    control,
    name: "emergencyContacts",
  });

  const isPR = watch("isPermanentResidentOrCitizen");
  const visaTitle = watch("visaTitle");

  const watchedProfilePicture = watch("profilePicture");
  const watchedDriverLicense = watch("driverLicense");
  const watchedWorkAuthDocument = watch("optReceipt");

  /*
    Fill the form again when a rejected application is returned.

    react-hook-form defaultValues only work on the first render.
    For rejected applications, reset() is needed to put old data back.
  */
  const fillFormWithApplication = (app) => {
    reset({
      email: user?.email || "",

      firstName: app.firstName || "",
      lastName: app.lastName || "",
      middleName: app.middleName || "",
      preferredName: app.preferredName || "",

      street: app.address?.street || "",
      building: app.address?.building || "",
      city: app.address?.city || "",
      state: app.address?.state || "",
      zip: app.address?.zip || "",

      cellPhone: app.cellPhone || "",
      workPhone: app.workPhone || "",

      ssn: app.ssn || "",
      dateOfBirth: app.dateOfBirth ? app.dateOfBirth.slice(0, 10) : "",
      gender: app.gender || "",

      isPermanentResidentOrCitizen: app.isPermanentResidentOrCitizen
        ? "yes"
        : "no",

      residentType: app.residentType || "",

      visaTitle: app.workAuthorization?.visaTitle || "",
      otherTitle: app.workAuthorization?.otherTitle || "",
      startDate: app.workAuthorization?.startDate
        ? app.workAuthorization.startDate.slice(0, 10)
        : "",
      endDate: app.workAuthorization?.endDate
        ? app.workAuthorization.endDate.slice(0, 10)
        : "",

      referenceFirstName: app.reference?.firstName || "",
      referenceLastName: app.reference?.lastName || "",
      referenceMiddleName: app.reference?.middleName || "",
      referencePhone: app.reference?.phone || "",
      referenceEmail: app.reference?.email || "",
      referenceRelationship: app.reference?.relationship || "",

      emergencyContacts:
        app.emergencyContacts && app.emergencyContacts.length > 0
          ? app.emergencyContacts
          : [
              {
                firstName: "",
                lastName: "",
                middleName: "",
                phone: "",
                email: "",
                relationship: "",
              },
            ],
    });

    if (app.profilePicture?.fileName) {
      setProfilePreview(
        `http://localhost:5001/uploads/${app.profilePicture.fileName}`
      );
    } else {
      setProfilePreview(DEFAULT_AVATAR_URL);
    }
  };

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await getMyApplication();
        const app = res.application || null;

        if (!app) {
          dispatch(updateOnboardingStatus("never_submitted"));
          setApplication(null);
          setProfilePreview(DEFAULT_AVATAR_URL);
        } else {
          dispatch(updateOnboardingStatus(res.status || app.status));
          setApplication(app);

          if (app.status === "rejected") {
            fillFormWithApplication(app);
          }

          if (app.status !== "rejected" && app.profilePicture?.fileName) {
            setProfilePreview(
              `http://localhost:5001/uploads/${app.profilePicture.fileName}`
            );
          }
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchStatus();
  }, [dispatch, reset, user?.email]);

  if (!user) {
    return null;
  }

  const onboardingStatus = user.onboardingStatus || "never_submitted";

  if (onboardingStatus === "approved") {
    return <Navigate to="/personal-info" replace />;
  }

  if (onboardingStatus === "pending") {
    return (
      <Layout>
        <h1 className="mb-4">Onboarding Status</h1>

        <Alert variant="secondary">
          Pending: Please wait for HR to review your application.
        </Alert>
      </Layout>
    );
  }

  /*
    Reference is optional.
    But if user fills any reference field, first name, last name,
    and relationship become required.
  */
  const hasReference = (data) => {
    return (
      data.referenceFirstName ||
      data.referenceLastName ||
      data.referenceMiddleName ||
      data.referencePhone ||
      data.referenceEmail ||
      data.referenceRelationship
    );
  };

  /*
    Update profile picture preview before final submit.
  */
  const handleProfilePictureChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      setProfilePreview(DEFAULT_AVATAR_URL);
      return;
    }

    setProfilePreview(URL.createObjectURL(file));
  };

  const onSubmit = async (data) => {
    const formData = new FormData();

    formData.append("firstName", data.firstName);
    formData.append("lastName", data.lastName);
    formData.append("middleName", data.middleName || "");
    formData.append("preferredName", data.preferredName || "");
    formData.append("cellPhone", data.cellPhone);
    formData.append("workPhone", data.workPhone || "");
    formData.append("ssn", data.ssn);
    formData.append("dateOfBirth", data.dateOfBirth);
    formData.append("gender", data.gender);

    formData.append(
      "isPermanentResidentOrCitizen",
      data.isPermanentResidentOrCitizen === "yes"
    );

    formData.append("residentType", data.residentType || "");

    formData.append(
      "address",
      JSON.stringify({
        building: data.building || "",
        street: data.street,
        city: data.city,
        state: data.state,
        zip: data.zip,
      })
    );

    formData.append(
      "workAuthorization",
      JSON.stringify({
        visaTitle: data.visaTitle || "",
        otherTitle: data.otherTitle || "",
        startDate: data.startDate || null,
        endDate: data.endDate || null,
      })
    );

    if (hasReference(data)) {
      formData.append(
        "reference",
        JSON.stringify({
          firstName: data.referenceFirstName,
          lastName: data.referenceLastName,
          middleName: data.referenceMiddleName || "",
          phone: data.referencePhone || "",
          email: data.referenceEmail || "",
          relationship: data.referenceRelationship,
        })
      );
    }

    formData.append(
      "emergencyContacts",
      JSON.stringify(data.emergencyContacts)
    );

    if (data.profilePicture?.[0]) {
      formData.append("profilePicture", data.profilePicture[0]);
    }

    if (data.driverLicense?.[0]) {
      formData.append("driverLicense", data.driverLicense[0]);
    }

    if (data.optReceipt?.[0]) {
      formData.append("optReceipt", data.optReceipt[0]);
    }

    try {
      await submitOnboardingApplication(formData);
      dispatch(updateOnboardingStatus("pending"));
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <Layout>
      {onboardingStatus === "rejected" ? (
        <>
          <h1 className="mb-4">Application Rejected</h1>

          <Alert variant="danger">
            <strong>HR Feedback:</strong>
            <p className="mb-0">
              {application?.feedback ||
                "Your application was rejected. Please update and resubmit."}
            </p>
          </Alert>
        </>
      ) : (
        <>
          <h1 className="mb-2">Onboarding Application</h1>
          <p className="text-muted mb-4">
            Please fill out your onboarding application.
          </p>
        </>
      )}

      <Form onSubmit={handleSubmit(onSubmit)}>
        {/* Basic Profile */}
        <Card className="mb-3">
          <Card.Body>
            <Card.Title className="mb-3">Basic Profile</Card.Title>

            <div className="d-flex align-items-center gap-3 mb-4">
              <img
                src={profilePreview}
                alt="Current profile preview"
                style={{
                  width: "96px",
                  height: "96px",
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: "1px solid #ddd",
                }}
              />

              <div>
                <h5 className="mb-1">Current Profile Picture</h5>
                <p className="text-muted mb-0">
                  This image will be used as your employee profile picture.
                </p>
              </div>
            </div>

            <Row className="g-3">
              <Col xs={12} md={6}>
                <Form.Group>
                  <Form.Label>First Name *</Form.Label>
                  <Form.Control
                    placeholder="First Name"
                    {...register("firstName", {
                      required: "First name is required",
                    })}
                  />
                  {errors.firstName && (
                    <Form.Text className="text-danger">
                      {errors.firstName.message}
                    </Form.Text>
                  )}
                </Form.Group>
              </Col>

              <Col xs={12} md={6}>
                <Form.Group>
                  <Form.Label>Last Name *</Form.Label>
                  <Form.Control
                    placeholder="Last Name"
                    {...register("lastName", {
                      required: "Last name is required",
                    })}
                  />
                  {errors.lastName && (
                    <Form.Text className="text-danger">
                      {errors.lastName.message}
                    </Form.Text>
                  )}
                </Form.Group>
              </Col>

              <Col xs={12} md={6}>
                <Form.Group>
                  <Form.Label>Middle Name</Form.Label>
                  <Form.Control
                    placeholder="Middle Name"
                    {...register("middleName")}
                  />
                </Form.Group>
              </Col>

              <Col xs={12} md={6}>
                <Form.Group>
                  <Form.Label>Preferred Name</Form.Label>
                  <Form.Control
                    placeholder="Preferred Name"
                    {...register("preferredName")}
                  />
                </Form.Group>
              </Col>

              <Col xs={12}>
                <Form.Group>
                  <Form.Label>Profile Picture</Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    {...register("profilePicture", {
                      onChange: handleProfilePictureChange,
                    })}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Address */}
        <Card className="mb-3">
          <Card.Body>
            <Card.Title className="mb-3">Address</Card.Title>

            <Row className="g-3">
              <Col xs={12} md={6}>
                <Form.Group>
                  <Form.Label>Street *</Form.Label>
                  <Form.Control
                    placeholder="Street"
                    {...register("street", {
                      required: "Street is required",
                    })}
                  />
                  {errors.street && (
                    <Form.Text className="text-danger">
                      {errors.street.message}
                    </Form.Text>
                  )}
                </Form.Group>
              </Col>

              <Col xs={12} md={6}>
                <Form.Group>
                  <Form.Label>Building / Apt</Form.Label>
                  <Form.Control
                    placeholder="Building / Apt"
                    {...register("building")}
                  />
                </Form.Group>
              </Col>

              <Col xs={12} md={4}>
                <Form.Group>
                  <Form.Label>City *</Form.Label>
                  <Form.Control
                    placeholder="City"
                    {...register("city", {
                      required: "City is required",
                    })}
                  />
                  {errors.city && (
                    <Form.Text className="text-danger">
                      {errors.city.message}
                    </Form.Text>
                  )}
                </Form.Group>
              </Col>

              <Col xs={12} md={4}>
                <Form.Group>
                  <Form.Label>State *</Form.Label>
                  <Form.Control
                    placeholder="State"
                    {...register("state", {
                      required: "State is required",
                    })}
                  />
                  {errors.state && (
                    <Form.Text className="text-danger">
                      {errors.state.message}
                    </Form.Text>
                  )}
                </Form.Group>
              </Col>

              <Col xs={12} md={4}>
                <Form.Group>
                  <Form.Label>Zip *</Form.Label>
                  <Form.Control
                    placeholder="Zip"
                    {...register("zip", {
                      required: "Zip is required",
                    })}
                  />
                  {errors.zip && (
                    <Form.Text className="text-danger">
                      {errors.zip.message}
                    </Form.Text>
                  )}
                </Form.Group>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Contact */}
        <Card className="mb-3">
          <Card.Body>
            <Card.Title className="mb-3">Contact</Card.Title>

            <Row className="g-3">
              <Col xs={12} md={6}>
                <Form.Group>
                  <Form.Label>Cell Phone Number *</Form.Label>
                  <Form.Control
                    placeholder="Cell Phone"
                    {...register("cellPhone", {
                      required: "Cell phone is required",
                    })}
                  />
                  {errors.cellPhone && (
                    <Form.Text className="text-danger">
                      {errors.cellPhone.message}
                    </Form.Text>
                  )}
                </Form.Group>
              </Col>

              <Col xs={12} md={6}>
                <Form.Group>
                  <Form.Label>Work Phone Number</Form.Label>
                  <Form.Control
                    placeholder="Work Phone"
                    {...register("workPhone")}
                  />
                </Form.Group>
              </Col>

              <Col xs={12}>
                <Form.Group>
                  <Form.Label>Email</Form.Label>
                  <Form.Control value={user.email || ""} disabled readOnly />
                </Form.Group>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Personal Details */}
        <Card className="mb-3">
          <Card.Body>
            <Card.Title className="mb-3">Personal Details</Card.Title>

            <Row className="g-3">
              <Col xs={12} md={4}>
                <Form.Group>
                  <Form.Label>SSN *</Form.Label>
                  <Form.Control
                    placeholder="SSN"
                    {...register("ssn", {
                      required: "SSN is required",
                    })}
                  />
                  {errors.ssn && (
                    <Form.Text className="text-danger">
                      {errors.ssn.message}
                    </Form.Text>
                  )}
                </Form.Group>
              </Col>

              <Col xs={12} md={4}>
                <Form.Group>
                  <Form.Label>Date of Birth *</Form.Label>
                  <Form.Control
                    type="date"
                    {...register("dateOfBirth", {
                      required: "Date of birth is required",
                    })}
                  />
                  {errors.dateOfBirth && (
                    <Form.Text className="text-danger">
                      {errors.dateOfBirth.message}
                    </Form.Text>
                  )}
                </Form.Group>
              </Col>

              <Col xs={12} md={4}>
                <Form.Group>
                  <Form.Label>Gender *</Form.Label>
                  <Form.Select
                    {...register("gender", {
                      required: "Gender is required",
                    })}
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="i_do_not_wish_to_answer">
                      I do not wish to answer
                    </option>
                  </Form.Select>
                  {errors.gender && (
                    <Form.Text className="text-danger">
                      {errors.gender.message}
                    </Form.Text>
                  )}
                </Form.Group>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Work Authorization */}
        <Card className="mb-3">
          <Card.Body>
            <Card.Title className="mb-3">Work Authorization</Card.Title>

            <Row className="g-3">
              <Col xs={12}>
                <Form.Group>
                  <Form.Label>
                    Are you a permanent resident or citizen of the U.S.? *
                  </Form.Label>
                  <Form.Select
                    {...register("isPermanentResidentOrCitizen", {
                      required: "This field is required",
                    })}
                  >
                    <option value="">Select</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </Form.Select>
                  {errors.isPermanentResidentOrCitizen && (
                    <Form.Text className="text-danger">
                      {errors.isPermanentResidentOrCitizen.message}
                    </Form.Text>
                  )}
                </Form.Group>
              </Col>

              {isPR === "yes" && (
                <Col xs={12} md={6}>
                  <Form.Group>
                    <Form.Label>Status Type *</Form.Label>
                    <Form.Select
                      {...register("residentType", {
                        required:
                          isPR === "yes" ? "Status type is required" : false,
                      })}
                    >
                      <option value="">Select Type</option>
                      <option value="green_card">Green Card</option>
                      <option value="citizen">Citizen</option>
                    </Form.Select>
                    {errors.residentType && (
                      <Form.Text className="text-danger">
                        {errors.residentType.message}
                      </Form.Text>
                    )}
                  </Form.Group>
                </Col>
              )}

              {isPR === "no" && (
                <>
                  <Col xs={12} md={6}>
                    <Form.Group>
                      <Form.Label>Work Authorization Type *</Form.Label>
                      <Form.Select
                        {...register("visaTitle", {
                          required:
                            isPR === "no"
                              ? "Work authorization type is required"
                              : false,
                        })}
                      >
                        <option value="">Select Work Authorization</option>
                        <option value="h1b">H1-B</option>
                        <option value="l2">L2</option>
                        <option value="f1_cpt_opt">F1 CPT/OPT</option>
                        <option value="h4">H4</option>
                        <option value="other">Other</option>
                      </Form.Select>
                      {errors.visaTitle && (
                        <Form.Text className="text-danger">
                          {errors.visaTitle.message}
                        </Form.Text>
                      )}
                    </Form.Group>
                  </Col>

                  {visaTitle === "other" && (
                    <Col xs={12} md={6}>
                      <Form.Group>
                        <Form.Label>Other Visa Title *</Form.Label>
                        <Form.Control
                          placeholder="Other Visa Title"
                          {...register("otherTitle", {
                            required:
                              visaTitle === "other"
                                ? "Other visa title is required"
                                : false,
                          })}
                        />
                        {errors.otherTitle && (
                          <Form.Text className="text-danger">
                            {errors.otherTitle.message}
                          </Form.Text>
                        )}
                      </Form.Group>
                    </Col>
                  )}

                  <Col xs={12} md={6}>
                    <Form.Group>
                      <Form.Label>Start Date *</Form.Label>
                      <Form.Control
                        type="date"
                        {...register("startDate", {
                          required:
                            isPR === "no" ? "Start date is required" : false,
                        })}
                      />
                      {errors.startDate && (
                        <Form.Text className="text-danger">
                          {errors.startDate.message}
                        </Form.Text>
                      )}
                    </Form.Group>
                  </Col>

                  <Col xs={12} md={6}>
                    <Form.Group>
                      <Form.Label>End Date *</Form.Label>
                      <Form.Control
                        type="date"
                        {...register("endDate", {
                          required:
                            isPR === "no" ? "End date is required" : false,
                        })}
                      />
                      {errors.endDate && (
                        <Form.Text className="text-danger">
                          {errors.endDate.message}
                        </Form.Text>
                      )}
                    </Form.Group>
                  </Col>

                  <Col xs={12}>
                    <Form.Group>
                      <Form.Label>Work Authorization Document *</Form.Label>
                      <Form.Text className="d-block text-muted mb-2">
                        For F1 CPT/OPT users, please upload OPT Receipt.
                      </Form.Text>
                      <Form.Control
                        type="file"
                        accept=".pdf,image/*"
                        {...register("optReceipt", {
                          validate: (files) => {
                            if (
                              isPR === "no" &&
                              (!files || files.length === 0)
                            ) {
                              return "Work authorization document is required";
                            }

                            return true;
                          },
                        })}
                      />
                      {errors.optReceipt && (
                        <Form.Text className="text-danger">
                          {errors.optReceipt.message}
                        </Form.Text>
                      )}
                    </Form.Group>
                  </Col>
                </>
              )}

              <Col xs={12}>
                <Form.Group>
                  <Form.Label>Driver License</Form.Label>
                  <Form.Control
                    type="file"
                    accept=".pdf,image/*"
                    {...register("driverLicense")}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Reference */}
        <Card className="mb-3">
          <Card.Body>
            <Card.Title className="mb-3">Reference</Card.Title>

            <p className="text-muted small mb-3">
              Reference is optional. If you provide a reference, first name,
              last name, and relationship are required.
            </p>

            <Row className="g-3">
              <Col xs={12} md={6}>
                <Form.Group>
                  <Form.Label>Reference First Name</Form.Label>
                  <Form.Control
                    placeholder="Reference First Name"
                    {...register("referenceFirstName", {
                      validate: (value, formValues) => {
                        const hasAnyReference =
                          value ||
                          formValues.referenceLastName ||
                          formValues.referenceMiddleName ||
                          formValues.referencePhone ||
                          formValues.referenceEmail ||
                          formValues.referenceRelationship;

                        if (hasAnyReference && !value) {
                          return "First name is required if reference is provided";
                        }

                        return true;
                      },
                    })}
                  />
                  {errors.referenceFirstName && (
                    <Form.Text className="text-danger">
                      {errors.referenceFirstName.message}
                    </Form.Text>
                  )}
                </Form.Group>
              </Col>

              <Col xs={12} md={6}>
                <Form.Group>
                  <Form.Label>Reference Last Name</Form.Label>
                  <Form.Control
                    placeholder="Reference Last Name"
                    {...register("referenceLastName", {
                      validate: (value, formValues) => {
                        const hasAnyReference =
                          formValues.referenceFirstName ||
                          value ||
                          formValues.referenceMiddleName ||
                          formValues.referencePhone ||
                          formValues.referenceEmail ||
                          formValues.referenceRelationship;

                        if (hasAnyReference && !value) {
                          return "Last name is required if reference is provided";
                        }

                        return true;
                      },
                    })}
                  />
                  {errors.referenceLastName && (
                    <Form.Text className="text-danger">
                      {errors.referenceLastName.message}
                    </Form.Text>
                  )}
                </Form.Group>
              </Col>

              <Col xs={12} md={6}>
                <Form.Group>
                  <Form.Label>Reference Middle Name</Form.Label>
                  <Form.Control
                    placeholder="Reference Middle Name"
                    {...register("referenceMiddleName")}
                  />
                </Form.Group>
              </Col>

              <Col xs={12} md={6}>
                <Form.Group>
                  <Form.Label>Reference Phone</Form.Label>
                  <Form.Control
                    placeholder="Reference Phone"
                    {...register("referencePhone")}
                  />
                </Form.Group>
              </Col>

              <Col xs={12} md={6}>
                <Form.Group>
                  <Form.Label>Reference Email</Form.Label>
                  <Form.Control
                    placeholder="Reference Email"
                    {...register("referenceEmail")}
                  />
                </Form.Group>
              </Col>

              <Col xs={12} md={6}>
                <Form.Group>
                  <Form.Label>Reference Relationship</Form.Label>
                  <Form.Control
                    placeholder="Relationship"
                    {...register("referenceRelationship", {
                      validate: (value, formValues) => {
                        const hasAnyReference =
                          formValues.referenceFirstName ||
                          formValues.referenceLastName ||
                          formValues.referenceMiddleName ||
                          formValues.referencePhone ||
                          formValues.referenceEmail ||
                          value;

                        if (hasAnyReference && !value) {
                          return "Relationship is required if reference is provided";
                        }

                        return true;
                      },
                    })}
                  />
                  {errors.referenceRelationship && (
                    <Form.Text className="text-danger">
                      {errors.referenceRelationship.message}
                    </Form.Text>
                  )}
                </Form.Group>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Emergency Contact */}
        <Card className="mb-3">
          <Card.Body>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <Card.Title className="mb-0">Emergency Contact</Card.Title>

              <Button
                type="button"
                size="sm"
                variant="outline-primary"
                onClick={() =>
                  appendEmergencyContact({
                    firstName: "",
                    lastName: "",
                    middleName: "",
                    phone: "",
                    email: "",
                    relationship: "",
                  })
                }
              >
                Add Contact
              </Button>
            </div>

            {emergencyFields.map((field, index) => (
              <Card key={field.id} className="mb-3 border">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h6 className="mb-0">Emergency Contact {index + 1}</h6>

                    {emergencyFields.length > 1 && (
                      <Button
                        type="button"
                        size="sm"
                        variant="outline-danger"
                        onClick={() => removeEmergencyContact(index)}
                      >
                        Remove
                      </Button>
                    )}
                  </div>

                  <Row className="g-3">
                    <Col xs={12} md={6}>
                      <Form.Group>
                        <Form.Label>First Name *</Form.Label>
                        <Form.Control
                          placeholder="Emergency First Name"
                          {...register(
                            `emergencyContacts.${index}.firstName`,
                            {
                              required: "First name is required",
                            }
                          )}
                        />
                        {errors.emergencyContacts?.[index]?.firstName && (
                          <Form.Text className="text-danger">
                            {
                              errors.emergencyContacts[index].firstName
                                .message
                            }
                          </Form.Text>
                        )}
                      </Form.Group>
                    </Col>

                    <Col xs={12} md={6}>
                      <Form.Group>
                        <Form.Label>Last Name *</Form.Label>
                        <Form.Control
                          placeholder="Emergency Last Name"
                          {...register(
                            `emergencyContacts.${index}.lastName`,
                            {
                              required: "Last name is required",
                            }
                          )}
                        />
                        {errors.emergencyContacts?.[index]?.lastName && (
                          <Form.Text className="text-danger">
                            {errors.emergencyContacts[index].lastName.message}
                          </Form.Text>
                        )}
                      </Form.Group>
                    </Col>

                    <Col xs={12} md={6}>
                      <Form.Group>
                        <Form.Label>Middle Name</Form.Label>
                        <Form.Control
                          placeholder="Emergency Middle Name"
                          {...register(
                            `emergencyContacts.${index}.middleName`
                          )}
                        />
                      </Form.Group>
                    </Col>

                    <Col xs={12} md={6}>
                      <Form.Group>
                        <Form.Label>Phone</Form.Label>
                        <Form.Control
                          placeholder="Emergency Phone"
                          {...register(`emergencyContacts.${index}.phone`)}
                        />
                      </Form.Group>
                    </Col>

                    <Col xs={12} md={6}>
                      <Form.Group>
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                          placeholder="Emergency Email"
                          {...register(`emergencyContacts.${index}.email`)}
                        />
                      </Form.Group>
                    </Col>

                    <Col xs={12} md={6}>
                      <Form.Group>
                        <Form.Label>Relationship *</Form.Label>
                        <Form.Control
                          placeholder="Relationship"
                          {...register(
                            `emergencyContacts.${index}.relationship`,
                            {
                              required: "Relationship is required",
                            }
                          )}
                        />
                        {errors.emergencyContacts?.[index]?.relationship && (
                          <Form.Text className="text-danger">
                            {
                              errors.emergencyContacts[index].relationship
                                .message
                            }
                          </Form.Text>
                        )}
                      </Form.Group>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            ))}
          </Card.Body>
        </Card>

        {/* Upload Summary */}
        <Card className="mb-3">
          <Card.Body>
            <Card.Title className="mb-3">Selected Upload Summary</Card.Title>

            <p className="text-muted small mb-3">
              Please review selected files before submitting your application.
            </p>

            <Row className="g-3">
              <SummaryItem
                label="Profile Picture"
                fileList={watchedProfilePicture}
              />

              <SummaryItem
                label="Driver License"
                fileList={watchedDriverLicense}
              />

              <SummaryItem
                label={
                  visaTitle === "f1_cpt_opt"
                    ? "OPT Receipt"
                    : "Work Authorization Document"
                }
                fileList={watchedWorkAuthDocument}
              />
            </Row>
          </Card.Body>
        </Card>

        <div className="d-flex justify-content-end mb-4">
          <Button type="submit" variant="primary">
            Submit Application
          </Button>
        </div>
      </Form>
    </Layout>
  );
}

function SummaryItem({ label, fileList }) {
  const file = getSelectedFile(fileList);
  const [fileUrl, setFileUrl] = useState("");

  /*
    Create a temporary browser URL for the selected local file.
    This lets the employee preview and download before final submit.
  */
  useEffect(() => {
    if (!file) {
      setFileUrl("");
      return;
    }

    const url = URL.createObjectURL(file);
    setFileUrl(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [file]);

  const canPreview =
    file && (file.type.startsWith("image/") || file.type === "application/pdf");

  const handlePreview = () => {
    if (!fileUrl || !canPreview) {
      return;
    }

    window.open(fileUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <Col xs={12} md={4}>
      <div className="mb-2">
        <strong>{label}:</strong>
      </div>

      <div className="mb-2">
        {file ? file.name : <span className="text-muted">No file selected</span>}
      </div>

      {file && (
        <div className="d-flex gap-2">
          <Button
            type="button"
            size="sm"
            variant="outline-primary"
            onClick={handlePreview}
            disabled={!canPreview}
          >
            Preview
          </Button>

          <Button
            as="a"
            href={fileUrl}
            download={file.name}
            size="sm"
            variant="outline-secondary"
          >
            Download
          </Button>
        </div>
      )}

      {file && !canPreview && (
        <Form.Text className="text-muted">
          Preview is only available for images and PDF files.
        </Form.Text>
      )}
    </Col>
  );
}

function getSelectedFile(fileList) {
  if (!fileList || fileList.length === 0) {
    return null;
  }

  return fileList[0] || null;
}