import { useEffect, useState } from "react";
import { Alert, Badge, Button, Card, Col, Form, Row } from "react-bootstrap";

import { getMyVisaStatus, uploadVisaDocument } from "../../api/visaApi";
import DocumentItem from "../../components/profile/DocumentItem";
import Layout from "../../components/common/Layout";
import Loading from "../../components/common/Loading";

/*
  VisaStatusPage

  Employee uses this page to track OPT visa document status.

  Document order:
  1. OPT Receipt
  2. OPT EAD
  3. I-983
  4. I-20

  Rules from project document:
  - Users can only upload the next document after previous document is approved by HR.
  - Each step shows strict messages from the project document.
  - If rejected, users see HR feedback.
  - I-983 step shows Empty Template and Sample Template download buttons.
*/

const I983_EMPTY_TEMPLATE_URL =
  "http://localhost:5001/templates/i983_Empty_Template.pdf";

const I983_SAMPLE_TEMPLATE_URL =
  "http://localhost:5001/templates/i983_Sample_Template.pdf";

const VISA_STEPS = [
  {
    key: "opt_receipt",
    label: "OPT Receipt",
    description: "Submitted during onboarding application.",
  },
  {
    key: "opt_ead",
    label: "OPT EAD",
    description: "Upload a copy of your OPT EAD.",
  },
  {
    key: "i_983",
    label: "I-983",
    description: "Download templates and upload the filled out form.",
  },
  {
    key: "i_20",
    label: "I-20",
    description: "Upload your new I-20.",
  },
];

export default function VisaStatusPage() {
  const [data, setData] = useState(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVisaStatus();
  }, []);

  const fetchVisaStatus = async () => {
    try {
      const res = await getMyVisaStatus();
      setData(res);
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  /*
    Get document by visa step.
  */
  const getDocumentByStep = (stepKey) => {
    if (!data?.visaStatus) {
      return null;
    }

    if (stepKey === "opt_receipt") {
      return data.visaStatus.optReceipt;
    }

    if (stepKey === "opt_ead") {
      return data.visaStatus.optEad;
    }

    if (stepKey === "i_983") {
      return data.visaStatus.i983;
    }

    if (stepKey === "i_20") {
      return data.visaStatus.i20;
    }

    return null;
  };

  /*
    Get current step document.
  */
  const getCurrentDocument = () => {
    return getDocumentByStep(data?.currentStep);
  };

  /*
    Get document status.
  */
  const getDocumentStatus = (document) => {
    return document?.status || "";
  };

  /*
    Strict current action message based on project document.
  */
  const getCurrentActionMessage = () => {
    if (!data) {
      return "";
    }

    if (data.currentStep === "completed") {
      return "All documents have been approved.";
    }

    const currentDocument = getCurrentDocument();
    const status = getDocumentStatus(currentDocument);

    if (status === "rejected") {
      return data.feedback || "Rejected. Please review HR feedback.";
    }

    if (data.currentStep === "opt_receipt") {
      if (status === "pending") {
        return "Waiting for HR to approve your OPT Receipt.";
      }

      return "Please upload your OPT Receipt.";
    }

    if (data.currentStep === "opt_ead") {
      if (status === "pending") {
        return "Waiting for HR to approve your OPT EAD.";
      }

      return "Please upload a copy of your OPT EAD.";
    }

    if (data.currentStep === "i_983") {
      if (status === "pending") {
        return "Waiting for HR to approve and sign your I-983.";
      }

      return "Please download and fill out the I-983 form.";
    }

    if (data.currentStep === "i_20") {
      if (status === "pending") {
        return "Waiting for HR to approve your I-20.";
      }

      return "Please send the I-983 along with all necessary documents to your school and upload the new I-20.";
    }

    return data.message || "";
  };

  /*
    Check whether this step has uploaded document.
  */
  const hasDocument = (stepKey) => {
    return Boolean(getDocumentByStep(stepKey));
  };

  /*
    Current step index for tracker.
  */
  const getCurrentStepIndex = () => {
    if (data?.currentStep === "completed") {
      return VISA_STEPS.length;
    }

    return VISA_STEPS.findIndex((step) => step.key === data?.currentStep);
  };

  /*
    Decide each step status badge.
  */
  const getStepStatus = (stepKey, index) => {
    const currentIndex = getCurrentStepIndex();
    const document = getDocumentByStep(stepKey);
    const documentStatus = getDocumentStatus(document);

    if (data?.currentStep === "completed") {
      return "completed";
    }

    if (documentStatus === "rejected") {
      return "rejected";
    }

    if (documentStatus === "pending") {
      return "pending_review";
    }

    if (documentStatus === "approved") {
      return "completed";
    }

    if (index < currentIndex) {
      return "completed";
    }

    if (index === currentIndex) {
      return hasDocument(stepKey) ? "pending_review" : "current";
    }

    return "not_started";
  };

  /*
    Upload file for current visa step.
  */
  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file");
      return;
    }

    try {
      await uploadVisaDocument(data.currentStep, file);
      alert("Uploaded successfully");
      setFile(null);
      await fetchVisaStatus();
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) {
    return (
      <Layout>
        <Loading text="Loading visa status..." />
      </Layout>
    );
  }

  if (!data.showVisaStatus) {
    return (
      <Layout>
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
          {data.message}
        </Alert>
      </Layout>
    );
  }

  const currentDocument = getCurrentDocument();
  const currentDocumentStatus = getDocumentStatus(currentDocument);
  const isI983Step = data.currentStep === "i_983";
  const isCompleted = data.currentStep === "completed";
  const isCurrentDocumentPending = currentDocumentStatus === "pending";
  const isCurrentDocumentRejected = currentDocumentStatus === "rejected";

  return (
    <Layout>
      <PageHeader title="Visa Status" />

      {/* Current Action */}
      <SectionCard title="Current Action">
        <div
          className="mb-3"
          style={{
            background: "#f8fafc",
            border: "1px solid #e5e7eb",
            borderRadius: "16px",
            padding: "14px 16px",
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
            Current Step
          </div>

          <div
            style={{
              color: "#1f2937",
              fontSize: "16px",
              fontWeight: "900",
              lineHeight: "1.4",
            }}
          >
            {isCompleted ? "Completed" : data.currentDocumentName}
          </div>
        </div>

        <Alert
          variant={
            isCompleted
              ? "success"
              : isCurrentDocumentRejected
              ? "danger"
              : isCurrentDocumentPending
              ? "warning"
              : "primary"
          }
          className="mb-0"
          style={{
            borderRadius: "16px",
            border: isCompleted
              ? "1px solid #bbf7d0"
              : isCurrentDocumentRejected
              ? "1px solid #fecaca"
              : isCurrentDocumentPending
              ? "1px solid #fde68a"
              : "1px solid #c7d2fe",
            background: isCompleted
              ? "#ecfdf3"
              : isCurrentDocumentRejected
              ? "#fef2f2"
              : isCurrentDocumentPending
              ? "#fffbeb"
              : "#eef2ff",
            color: isCompleted
              ? "#166534"
              : isCurrentDocumentRejected
              ? "#991b1b"
              : isCurrentDocumentPending
              ? "#92400e"
              : "#3730a3",
            fontSize: "14px",
            fontWeight: "700",
            lineHeight: "1.6",
            padding: "15px 16px",
          }}
        >
          {isCurrentDocumentRejected ? (
            <>
              <strong>HR Feedback:</strong> {getCurrentActionMessage()}
            </>
          ) : (
            getCurrentActionMessage()
          )}
        </Alert>
      </SectionCard>

      {/* Visa Progress Tracker */}
      <SectionCard title="Visa Progress Tracker">
        <Row className="g-3">
          {VISA_STEPS.map((step, index) => {
            const stepStatus = getStepStatus(step.key, index);
            const document = getDocumentByStep(step.key);

            return (
              <Col xs={12} md={6} lg={3} key={step.key}>
                <Card
                  className="h-100 border-0"
                  style={{
                    borderRadius: "18px",
                    background: "#f8fafc",
                    boxShadow: "inset 0 0 0 1px #e5e7eb",
                    overflow: "hidden",
                  }}
                >
                  <Card.Body className="p-3">
                    <div className="d-flex justify-content-between align-items-start gap-2 mb-2">
                      <h6
                        className="mb-0"
                        style={{
                          color: "#1f2937",
                          fontSize: "15px",
                          fontWeight: "900",
                          letterSpacing: "-0.02em",
                          lineHeight: "1.35",
                        }}
                      >
                        {step.label}
                      </h6>

                      <StepBadge status={stepStatus} />
                    </div>

                    <p
                      className="mb-3"
                      style={{
                        color: "#6b7280",
                        fontSize: "13px",
                        fontWeight: "600",
                        lineHeight: "1.5",
                        minHeight: "38px",
                      }}
                    >
                      {step.description}
                    </p>

                    <DocumentItem title={step.label} document={document} />
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </SectionCard>

      {/* I-983 Templates only show during I-983 step */}
      {isI983Step && (
        <SectionCard title="I-983 Templates">
          <p
            className="mb-3"
            style={{
              color: "#6b7280",
              fontSize: "14px",
              fontWeight: "600",
              lineHeight: "1.5",
            }}
          >
            Please download and fill out the I-983 form.
          </p>

          <Row className="g-3">
            <Col xs={12} md={6}>
              <TemplateCard
                title="Empty Template"
                description="Use this blank template to complete your I-983 form."
                href={I983_EMPTY_TEMPLATE_URL}
                buttonText="Download Empty Template"
              />
            </Col>

            <Col xs={12} md={6}>
              <TemplateCard
                title="Sample Template"
                description="Use this sample as a reference when filling out your form."
                href={I983_SAMPLE_TEMPLATE_URL}
                buttonText="Download Sample Template"
              />
            </Col>
          </Row>
        </SectionCard>
      )}

      {/* Upload Current Document */}
      {!isCompleted && !isCurrentDocumentPending && (
        <SectionCard title="Upload Current Document">
          {currentDocument && currentDocumentStatus !== "rejected" && (
            <Alert
              variant="warning"
              style={{
                borderRadius: "16px",
                border: "1px solid #fde68a",
                background: "#fffbeb",
                color: "#92400e",
                fontSize: "14px",
                fontWeight: "600",
                lineHeight: "1.6",
                padding: "15px 16px",
              }}
            >
              You already uploaded a file for this step. If you upload a new
              file, the latest file should replace the previous submitted file.
            </Alert>
          )}

          <Form.Group className="mb-3">
            <Form.Label
              style={{
                color: "#374151",
                fontSize: "14px",
                fontWeight: "800",
                marginBottom: "8px",
              }}
            >
              {isI983Step
                ? "Upload filled out I-983 form"
                : `Upload ${data.currentDocumentName}`}
            </Form.Label>

            <Form.Control
              type="file"
              accept=".pdf,image/*"
              onChange={(event) => setFile(event.target.files[0])}
              style={fileInputStyle}
            />
          </Form.Group>

          <Button
            type="button"
            variant="primary"
            onClick={handleUpload}
            className="fw-bold px-4 py-2"
            style={{ fontSize: "14px" }}
          >
            Upload
          </Button>
        </SectionCard>
      )}
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

function TemplateCard({ title, description, href, buttonText }) {
  return (
    <Card
      className="h-100 border-0"
      style={{
        borderRadius: "18px",
        background: "#f8fafc",
        boxShadow: "inset 0 0 0 1px #e5e7eb",
      }}
    >
      <Card.Body className="p-3 p-md-4">
        <h6
          className="mb-2"
          style={{
            color: "#1f2937",
            fontSize: "15px",
            fontWeight: "900",
            letterSpacing: "-0.02em",
          }}
        >
          {title}
        </h6>

        <p
          className="mb-3"
          style={{
            color: "#6b7280",
            fontSize: "13px",
            fontWeight: "600",
            lineHeight: "1.5",
          }}
        >
          {description}
        </p>

        <Button
          as="a"
          href={href}
          target="_blank"
          rel="noreferrer"
          variant="outline-primary"
          size="sm"
          className="fw-bold px-3 text-nowrap"
          style={{ fontSize: "12px" }}
        >
          {buttonText}
        </Button>
      </Card.Body>
    </Card>
  );
}

function StepBadge({ status }) {
  if (status === "completed") {
    return (
      <Badge
        bg="success"
        pill
        style={{
          padding: "7px 12px",
          fontSize: "12px",
          fontWeight: "800",
        }}
      >
        Completed
      </Badge>
    );
  }

  if (status === "pending_review") {
    return (
      <Badge
        bg="warning"
        text="dark"
        pill
        style={{
          padding: "7px 12px",
          fontSize: "12px",
          fontWeight: "800",
        }}
      >
        Pending
      </Badge>
    );
  }

  if (status === "rejected") {
    return (
      <Badge
        bg="danger"
        pill
        style={{
          padding: "7px 12px",
          fontSize: "12px",
          fontWeight: "800",
        }}
      >
        Rejected
      </Badge>
    );
  }

  if (status === "current") {
    return (
      <Badge
        bg="primary"
        pill
        style={{
          padding: "7px 12px",
          fontSize: "12px",
          fontWeight: "800",
        }}
      >
        Current
      </Badge>
    );
  }

  return (
    <Badge
      bg="secondary"
      pill
      style={{
        padding: "7px 12px",
        fontSize: "12px",
        fontWeight: "800",
      }}
    >
      Not Started
    </Badge>
  );
}

const fileInputStyle = {
  borderRadius: "14px",
  border: "1px solid #d8dee8",
  fontSize: "14px",
  fontWeight: "500",
  padding: "10px 14px",
  boxShadow: "none",
};