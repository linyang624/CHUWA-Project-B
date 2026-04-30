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
import DocumentActions from "../../components/common/DocumentActions";

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

  const existingProfilePicture = application?.profilePicture || null;
  const existingDriverLicense = application?.driverLicense || null;
  const existingWorkAuthDocument =
    application?.workAuthorization?.optReceipt || application?.optReceipt || null;

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
        <PageHeader title="Onboarding Status" />

        <Alert
          variant="secondary"
          style={{
            borderRadius: "16px",
            border: "1px solid #e5e7eb",
            background: "#ffffff",
            color: "#374151",
            fontSize: "14px",
            fontWeight: "700",
            padding: "16px 18px",
            boxShadow: "0 10px 24px rgba(15, 23, 42, 0.05)",
          }}
        >
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
      if (existingProfilePicture?.fileName) {
        setProfilePreview(
          `http://localhost:5001/uploads/${existingProfilePicture.fileName}`
        );
      } else {
        setProfilePreview(DEFAULT_AVATAR_URL);
      }

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
          <PageHeader title="Application Rejected" />

          <Alert
            variant="danger"
            style={{
              borderRadius: "16px",
              border: "1px solid #fecaca",
              background: "#fef2f2",
              color: "#991b1b",
              fontSize: "14px",
              fontWeight: "600",
              padding: "16px 18px",
              boxShadow: "0 10px 24px rgba(15, 23, 42, 0.05)",
            }}
          >
            <strong>HR Feedback:</strong>
            <p className="mb-0 mt-1">
              {application?.feedback ||
                "Your application was rejected. Please update and resubmit."}
            </p>
          </Alert>
        </>
      ) : (
        <PageHeader
          title="Onboarding Application"
          subtitle="Please fill out your onboarding application."
        />
      )}

      <Form onSubmit={handleSubmit(onSubmit)}>
        {/* Basic Profile */}
        <SectionCard title="Basic Profile">
          <div className="d-flex flex-column flex-sm-row align-items-sm-center gap-3 mb-4">
            <img
              src={profilePreview}
              alt="Current profile preview"
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
              <h5
                className="mb-1"
                style={{
                  color: "#1f2937",
                  fontSize: "18px",
                  fontWeight: "900",
                  letterSpacing: "-0.03em",
                }}
              >
                Current Profile Picture
              </h5>

              <p
                className="mb-0"
                style={{
                  color: "#6b7280",
                  fontSize: "14px",
                  fontWeight: "600",
                  lineHeight: "1.5",
                }}
              >
                This image will be used as your employee profile picture.
              </p>
            </div>
          </div>

          <Row className="g-3">
            <Col xs={12} md={6}>
              <FormField label="First Name *" error={errors.firstName?.message}>
                <Form.Control
                  placeholder="First Name"
                  {...register("firstName", {
                    required: "First name is required",
                  })}
                  style={inputStyle}
                />
              </FormField>
            </Col>

            <Col xs={12} md={6}>
              <FormField label="Last Name *" error={errors.lastName?.message}>
                <Form.Control
                  placeholder="Last Name"
                  {...register("lastName", {
                    required: "Last name is required",
                  })}
                  style={inputStyle}
                />
              </FormField>
            </Col>

            <Col xs={12} md={6}>
              <FormField label="Middle Name">
                <Form.Control
                  placeholder="Middle Name"
                  {...register("middleName")}
                  style={inputStyle}
                />
              </FormField>
            </Col>

            <Col xs={12} md={6}>
              <FormField label="Preferred Name">
                <Form.Control
                  placeholder="Preferred Name"
                  {...register("preferredName")}
                  style={inputStyle}
                />
              </FormField>
            </Col>

            <Col xs={12}>
              <FormField label="Profile Picture">
                <Form.Control
                  type="file"
                  accept="image/*"
                  {...register("profilePicture", {
                    onChange: handleProfilePictureChange,
                  })}
                  style={fileInputStyle}
                />
              </FormField>
            </Col>
          </Row>
        </SectionCard>

        {/* Address */}
        <SectionCard title="Address">
          <Row className="g-3">
            <Col xs={12} md={6}>
              <FormField label="Street *" error={errors.street?.message}>
                <Form.Control
                  placeholder="Street"
                  {...register("street", {
                    required: "Street is required",
                  })}
                  style={inputStyle}
                />
              </FormField>
            </Col>

            <Col xs={12} md={6}>
              <FormField label="Building / Apt">
                <Form.Control
                  placeholder="Building / Apt"
                  {...register("building")}
                  style={inputStyle}
                />
              </FormField>
            </Col>

            <Col xs={12} md={4}>
              <FormField label="City *" error={errors.city?.message}>
                <Form.Control
                  placeholder="City"
                  {...register("city", {
                    required: "City is required",
                  })}
                  style={inputStyle}
                />
              </FormField>
            </Col>

            <Col xs={12} md={4}>
              <FormField label="State *" error={errors.state?.message}>
                <Form.Control
                  placeholder="State"
                  {...register("state", {
                    required: "State is required",
                  })}
                  style={inputStyle}
                />
              </FormField>
            </Col>

            <Col xs={12} md={4}>
              <FormField label="Zip *" error={errors.zip?.message}>
                <Form.Control
                  placeholder="Zip"
                  {...register("zip", {
                    required: "Zip is required",
                  })}
                  style={inputStyle}
                />
              </FormField>
            </Col>
          </Row>
        </SectionCard>

        {/* Contact */}
        <SectionCard title="Contact">
          <Row className="g-3">
            <Col xs={12} md={6}>
              <FormField
                label="Cell Phone Number *"
                error={errors.cellPhone?.message}
              >
                <Form.Control
                  placeholder="Cell Phone"
                  {...register("cellPhone", {
                    required: "Cell phone is required",
                  })}
                  style={inputStyle}
                />
              </FormField>
            </Col>

            <Col xs={12} md={6}>
              <FormField label="Work Phone Number">
                <Form.Control
                  placeholder="Work Phone"
                  {...register("workPhone")}
                  style={inputStyle}
                />
              </FormField>
            </Col>

            <Col xs={12}>
              <FormField label="Email">
                <Form.Control
                  value={user.email || ""}
                  disabled
                  readOnly
                  style={{
                    ...inputStyle,
                    backgroundColor: "#eef2f7",
                    color: "#4b5563",
                  }}
                />
              </FormField>
            </Col>
          </Row>
        </SectionCard>

        {/* Personal Details */}
        <SectionCard title="Personal Details">
          <Row className="g-3">
            <Col xs={12} md={4}>
              <FormField label="SSN *" error={errors.ssn?.message}>
                <Form.Control
                  placeholder="SSN"
                  {...register("ssn", {
                    required: "SSN is required",
                  })}
                  style={inputStyle}
                />
              </FormField>
            </Col>

            <Col xs={12} md={4}>
              <FormField
                label="Date of Birth *"
                error={errors.dateOfBirth?.message}
              >
                <Form.Control
                  type="date"
                  {...register("dateOfBirth", {
                    required: "Date of birth is required",
                  })}
                  style={inputStyle}
                />
              </FormField>
            </Col>

            <Col xs={12} md={4}>
              <FormField label="Gender *" error={errors.gender?.message}>
                <Form.Select
                  {...register("gender", {
                    required: "Gender is required",
                  })}
                  style={inputStyle}
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="i_do_not_wish_to_answer">
                    I do not wish to answer
                  </option>
                </Form.Select>
              </FormField>
            </Col>
          </Row>
        </SectionCard>

        {/* Work Authorization */}
        <SectionCard title="Work Authorization">
          <Row className="g-3">
            <Col xs={12}>
              <FormField
                label="Are you a permanent resident or citizen of the U.S.? *"
                error={errors.isPermanentResidentOrCitizen?.message}
              >
                <Form.Select
                  {...register("isPermanentResidentOrCitizen", {
                    required: "This field is required",
                  })}
                  style={inputStyle}
                >
                  <option value="">Select</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </Form.Select>
              </FormField>
            </Col>

            {isPR === "yes" && (
              <Col xs={12} md={6}>
                <FormField
                  label="Status Type *"
                  error={errors.residentType?.message}
                >
                  <Form.Select
                    {...register("residentType", {
                      required:
                        isPR === "yes" ? "Status type is required" : false,
                    })}
                    style={inputStyle}
                  >
                    <option value="">Select Type</option>
                    <option value="green_card">Green Card</option>
                    <option value="citizen">Citizen</option>
                  </Form.Select>
                </FormField>
              </Col>
            )}

            {isPR === "no" && (
              <>
                <Col xs={12} md={6}>
                  <FormField
                    label="Work Authorization Type *"
                    error={errors.visaTitle?.message}
                  >
                    <Form.Select
                      {...register("visaTitle", {
                        required:
                          isPR === "no"
                            ? "Work authorization type is required"
                            : false,
                      })}
                      style={inputStyle}
                    >
                      <option value="">Select Work Authorization</option>
                      <option value="h1b">H1-B</option>
                      <option value="l2">L2</option>
                      <option value="f1_cpt_opt">F1 CPT/OPT</option>
                      <option value="h4">H4</option>
                      <option value="other">Other</option>
                    </Form.Select>
                  </FormField>
                </Col>

                {visaTitle === "other" && (
                  <Col xs={12} md={6}>
                    <FormField
                      label="Other Visa Title *"
                      error={errors.otherTitle?.message}
                    >
                      <Form.Control
                        placeholder="Other Visa Title"
                        {...register("otherTitle", {
                          required:
                            visaTitle === "other"
                              ? "Other visa title is required"
                              : false,
                        })}
                        style={inputStyle}
                      />
                    </FormField>
                  </Col>
                )}

                <Col xs={12} md={6}>
                  <FormField
                    label="Start Date *"
                    error={errors.startDate?.message}
                  >
                    <Form.Control
                      type="date"
                      {...register("startDate", {
                        required:
                          isPR === "no" ? "Start date is required" : false,
                      })}
                      style={inputStyle}
                    />
                  </FormField>
                </Col>

                <Col xs={12} md={6}>
                  <FormField label="End Date *" error={errors.endDate?.message}>
                    <Form.Control
                      type="date"
                      {...register("endDate", {
                        required:
                          isPR === "no" ? "End date is required" : false,
                      })}
                      style={inputStyle}
                    />
                  </FormField>
                </Col>

                <Col xs={12}>
                  <FormField
                    label="Work Authorization Document *"
                    helpText="For F1 CPT/OPT users, please upload OPT Receipt. If you select a new file, it will replace the previous one."
                    error={errors.optReceipt?.message}
                  >
                    <Form.Control
                      type="file"
                      accept=".pdf,image/*"
                      {...register("optReceipt", {
                        validate: (files) => {
                          if (
                            isPR === "no" &&
                            !existingWorkAuthDocument &&
                            (!files || files.length === 0)
                          ) {
                            return "Work authorization document is required";
                          }

                          return true;
                        },
                      })}
                      style={fileInputStyle}
                    />
                  </FormField>
                </Col>
              </>
            )}

            <Col xs={12}>
              <FormField label="Driver License">
                <Form.Control
                  type="file"
                  accept=".pdf,image/*"
                  {...register("driverLicense")}
                  style={fileInputStyle}
                />
              </FormField>
            </Col>
          </Row>
        </SectionCard>

        {/* Reference */}
        <SectionCard title="Reference">
          <p
            className="mb-3"
            style={{
              color: "#6b7280",
              fontSize: "13px",
              fontWeight: "600",
              lineHeight: "1.5",
            }}
          >
            Reference is optional. If you provide a reference, first name, last
            name, and relationship are required.
          </p>

          <Row className="g-3">
            <Col xs={12} md={6}>
              <FormField
                label="Reference First Name"
                error={errors.referenceFirstName?.message}
              >
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
                  style={inputStyle}
                />
              </FormField>
            </Col>

            <Col xs={12} md={6}>
              <FormField
                label="Reference Last Name"
                error={errors.referenceLastName?.message}
              >
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
                  style={inputStyle}
                />
              </FormField>
            </Col>

            <Col xs={12} md={6}>
              <FormField label="Reference Middle Name">
                <Form.Control
                  placeholder="Reference Middle Name"
                  {...register("referenceMiddleName")}
                  style={inputStyle}
                />
              </FormField>
            </Col>

            <Col xs={12} md={6}>
              <FormField label="Reference Phone">
                <Form.Control
                  placeholder="Reference Phone"
                  {...register("referencePhone")}
                  style={inputStyle}
                />
              </FormField>
            </Col>

            <Col xs={12} md={6}>
              <FormField label="Reference Email">
                <Form.Control
                  placeholder="Reference Email"
                  {...register("referenceEmail")}
                  style={inputStyle}
                />
              </FormField>
            </Col>

            <Col xs={12} md={6}>
              <FormField
                label="Reference Relationship"
                error={errors.referenceRelationship?.message}
              >
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
                  style={inputStyle}
                />
              </FormField>
            </Col>
          </Row>
        </SectionCard>

        {/* Emergency Contact */}
        <SectionCard>
          <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4">
            <h2
              className="mb-0"
              style={{
                color: "#1f2937",
                fontSize: "22px",
                fontWeight: "900",
                letterSpacing: "-0.04em",
              }}
            >
              Emergency Contact
            </h2>

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
              className="fw-bold px-3"
              style={{ fontSize: "12px" }}
            >
              Add Contact
            </Button>
          </div>

          {emergencyFields.map((field, index) => (
            <Card
              key={field.id}
              className="mb-3 border-0"
              style={{
                borderRadius: "18px",
                background: "#f8fafc",
                boxShadow: "inset 0 0 0 1px #e5e7eb",
              }}
            >
              <Card.Body className="p-3 p-md-4">
                <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-2 mb-3">
                  <h6
                    className="mb-0"
                    style={{
                      color: "#1f2937",
                      fontSize: "15px",
                      fontWeight: "900",
                      letterSpacing: "-0.02em",
                    }}
                  >
                    Emergency Contact {index + 1}
                  </h6>

                  {emergencyFields.length > 1 && (
                    <Button
                      type="button"
                      size="sm"
                      variant="outline-danger"
                      onClick={() => removeEmergencyContact(index)}
                      className="fw-bold px-3"
                      style={{ fontSize: "12px" }}
                    >
                      Remove
                    </Button>
                  )}
                </div>

                <Row className="g-3">
                  <Col xs={12} md={6}>
                    <FormField
                      label="First Name *"
                      error={
                        errors.emergencyContacts?.[index]?.firstName?.message
                      }
                    >
                      <Form.Control
                        placeholder="Emergency First Name"
                        {...register(
                          `emergencyContacts.${index}.firstName`,
                          {
                            required: "First name is required",
                          }
                        )}
                        style={inputStyle}
                      />
                    </FormField>
                  </Col>

                  <Col xs={12} md={6}>
                    <FormField
                      label="Last Name *"
                      error={
                        errors.emergencyContacts?.[index]?.lastName?.message
                      }
                    >
                      <Form.Control
                        placeholder="Emergency Last Name"
                        {...register(`emergencyContacts.${index}.lastName`, {
                          required: "Last name is required",
                        })}
                        style={inputStyle}
                      />
                    </FormField>
                  </Col>

                  <Col xs={12} md={6}>
                    <FormField label="Middle Name">
                      <Form.Control
                        placeholder="Emergency Middle Name"
                        {...register(
                          `emergencyContacts.${index}.middleName`
                        )}
                        style={inputStyle}
                      />
                    </FormField>
                  </Col>

                  <Col xs={12} md={6}>
                    <FormField label="Phone">
                      <Form.Control
                        placeholder="Emergency Phone"
                        {...register(`emergencyContacts.${index}.phone`)}
                        style={inputStyle}
                      />
                    </FormField>
                  </Col>

                  <Col xs={12} md={6}>
                    <FormField label="Email">
                      <Form.Control
                        placeholder="Emergency Email"
                        {...register(`emergencyContacts.${index}.email`)}
                        style={inputStyle}
                      />
                    </FormField>
                  </Col>

                  <Col xs={12} md={6}>
                    <FormField
                      label="Relationship *"
                      error={
                        errors.emergencyContacts?.[index]?.relationship?.message
                      }
                    >
                      <Form.Control
                        placeholder="Relationship"
                        {...register(
                          `emergencyContacts.${index}.relationship`,
                          {
                            required: "Relationship is required",
                          }
                        )}
                        style={inputStyle}
                      />
                    </FormField>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          ))}
        </SectionCard>

        {/* Upload Documents Summary */}
        <SectionCard title="Upload Documents Summary">
          <p
            className="mb-3"
            style={{
              color: "#6b7280",
              fontSize: "13px",
              fontWeight: "600",
              lineHeight: "1.5",
            }}
          >
            Review your uploaded documents before submitting. If you select a
            new file, it will replace the previous file after submission.
          </p>

          <Row className="g-3">
            <UploadSummaryItem
              label="Profile Picture"
              fileList={watchedProfilePicture}
              existingDocument={existingProfilePicture}
            />

            <UploadSummaryItem
              label="Driver License"
              fileList={watchedDriverLicense}
              existingDocument={existingDriverLicense}
            />

            <UploadSummaryItem
              label={
                visaTitle === "f1_cpt_opt"
                  ? "OPT Receipt"
                  : "Work Authorization Document"
              }
              fileList={watchedWorkAuthDocument}
              existingDocument={existingWorkAuthDocument}
            />
          </Row>
        </SectionCard>

        <div className="d-flex justify-content-end mb-4">
          <Button
            type="submit"
            variant="primary"
            className="fw-bold px-4 py-2"
            style={{ fontSize: "14px" }}
          >
            Submit Application
          </Button>
        </div>
      </Form>
    </Layout>
  );
}

function UploadSummaryItem({ label, fileList, existingDocument }) {
  const file = getSelectedFile(fileList);
  const [fileUrl, setFileUrl] = useState("");

  /*
    If the user selects a new file, create a temporary browser URL.
    This new file will replace the existing document after submit.
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
          {label}
        </div>

        {file ? (
          <>
            <div
              className="mb-3 text-truncate"
              style={{
                color: "#1f2937",
                fontSize: "13px",
                fontWeight: "700",
              }}
            >
              New file selected: {file.name}
            </div>

            <div className="d-flex flex-wrap gap-2">
              <Button
                type="button"
                size="sm"
                variant="outline-primary"
                onClick={handlePreview}
                disabled={!canPreview}
                className="fw-bold px-3"
                style={{ fontSize: "12px" }}
              >
                Preview
              </Button>

              <Button
                as="a"
                href={fileUrl}
                download={file.name}
                size="sm"
                variant="outline-secondary"
                className="fw-bold px-3"
                style={{ fontSize: "12px" }}
              >
                Download
              </Button>
            </div>

            {!canPreview && (
              <Form.Text
                style={{
                  color: "#6b7280",
                  fontSize: "12px",
                  fontWeight: "600",
                  marginTop: "8px",
                  display: "block",
                }}
              >
                Preview is only available for images and PDF files.
              </Form.Text>
            )}
          </>
        ) : existingDocument ? (
          <>
            <div
              className="mb-3"
              style={{
                color: "#6b7280",
                fontSize: "13px",
                fontWeight: "700",
              }}
            >
              Current uploaded file
            </div>

            <DocumentActions
              document={existingDocument}
              showPreview={true}
              showDownload={true}
            />
          </>
        ) : (
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "7px 12px",
              borderRadius: "999px",
              background: "#f3f4f6",
              color: "#6b7280",
              fontSize: "12px",
              fontWeight: "800",
            }}
          >
            No file uploaded
          </div>
        )}
      </div>
    </Col>
  );
}

function getSelectedFile(fileList) {
  if (!fileList || fileList.length === 0) {
    return null;
  }

  return fileList[0] || null;
}

function PageHeader({ title, subtitle }) {
  return (
    <div className="mb-4">
      <h1
        className="mb-2"
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

      {subtitle && (
        <p
          className="mb-0"
          style={{
            color: "#6b7280",
            fontSize: "15px",
            fontWeight: "600",
            lineHeight: "1.6",
          }}
        >
          {subtitle}
        </p>
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
        fontFamily:
          "Arial, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >
      <Card.Body className="p-4">
        {title && (
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
        )}

        {children}
      </Card.Body>
    </Card>
  );
}

function FormField({ label, helpText, error, children }) {
  return (
    <Form.Group>
      <Form.Label
        style={{
          color: "#374151",
          fontSize: "14px",
          fontWeight: "800",
          marginBottom: "8px",
        }}
      >
        {label}
      </Form.Label>

      {helpText && (
        <Form.Text
          className="d-block mb-2"
          style={{
            color: "#6b7280",
            fontSize: "13px",
            fontWeight: "600",
            lineHeight: "1.5",
          }}
        >
          {helpText}
        </Form.Text>
      )}

      {children}

      {error && (
        <Form.Text
          style={{
            color: "#dc2626",
            fontSize: "12px",
            fontWeight: "700",
            marginTop: "6px",
            display: "block",
          }}
        >
          {error}
        </Form.Text>
      )}
    </Form.Group>
  );
}

const inputStyle = {
  height: "48px",
  borderRadius: "14px",
  border: "1px solid #d8dee8",
  fontSize: "14px",
  fontWeight: "500",
  paddingLeft: "14px",
  boxShadow: "none",
};

const fileInputStyle = {
  borderRadius: "14px",
  border: "1px solid #d8dee8",
  fontSize: "14px",
  fontWeight: "500",
  padding: "10px 14px",
  boxShadow: "none",
};