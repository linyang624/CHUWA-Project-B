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
        <Alert variant="secondary">{data.message}</Alert>
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
      <h1 className="mb-4">Visa Status</h1>

      {/* Current Action */}
      <Card className="mb-3">
        <Card.Body>
          <Card.Title>Current Action</Card.Title>

          <p className="mb-2">
            <strong>Current Step:</strong>{" "}
            {isCompleted ? "Completed" : data.currentDocumentName}
          </p>

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
          >
            {isCurrentDocumentRejected ? (
              <>
                <strong>HR Feedback:</strong> {getCurrentActionMessage()}
              </>
            ) : (
              getCurrentActionMessage()
            )}
          </Alert>
        </Card.Body>
      </Card>

      {/* Visa Progress Tracker */}
      <Card className="mb-3">
        <Card.Body>
          <Card.Title>Visa Progress Tracker</Card.Title>

          <Row className="g-3">
            {VISA_STEPS.map((step, index) => {
              const stepStatus = getStepStatus(step.key, index);
              const document = getDocumentByStep(step.key);

              return (
                <Col xs={12} md={6} lg={3} key={step.key}>
                  <Card className="h-100">
                    <Card.Body>
                      <div className="d-flex justify-content-between align-items-start gap-2 mb-2">
                        <h6 className="mb-0">{step.label}</h6>
                        <StepBadge status={stepStatus} />
                      </div>

                      <p className="text-muted small mb-3">
                        {step.description}
                      </p>

                      <DocumentItem title={step.label} document={document} />
                    </Card.Body>
                  </Card>
                </Col>
              );
            })}
          </Row>
        </Card.Body>
      </Card>

      {/* I-983 Templates only show during I-983 step */}
      {isI983Step && (
        <Card className="mb-3">
          <Card.Body>
            <Card.Title>I-983 Templates</Card.Title>

            <p className="text-muted mb-3">
              Please download and fill out the I-983 form.
            </p>

            <Row className="g-3">
              <Col xs={12} md={6}>
                <Card className="h-100">
                  <Card.Body>
                    <h6>Empty Template</h6>
                    <p className="text-muted small mb-3">
                      Use this blank template to complete your I-983 form.
                    </p>

                    <Button
                      as="a"
                      href={I983_EMPTY_TEMPLATE_URL}
                      target="_blank"
                      rel="noreferrer"
                      variant="outline-primary"
                      size="sm"
                    >
                      Download Empty Template
                    </Button>
                  </Card.Body>
                </Card>
              </Col>

              <Col xs={12} md={6}>
                <Card className="h-100">
                  <Card.Body>
                    <h6>Sample Template</h6>
                    <p className="text-muted small mb-3">
                      Use this sample as a reference when filling out your form.
                    </p>

                    <Button
                      as="a"
                      href={I983_SAMPLE_TEMPLATE_URL}
                      target="_blank"
                      rel="noreferrer"
                      variant="outline-primary"
                      size="sm"
                    >
                      Download Sample Template
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      )}

      {/* Upload Current Document */}
      {!isCompleted && !isCurrentDocumentPending && (
        <Card className="mb-3">
          <Card.Body>
            <Card.Title>Upload Current Document</Card.Title>

            {currentDocument && currentDocumentStatus !== "rejected" && (
              <Alert variant="warning">
                You already uploaded a file for this step. If you upload a new
                file, the latest file should replace the previous submitted file.
              </Alert>
            )}

            <Form.Group className="mb-3">
              <Form.Label>
                {isI983Step
                  ? "Upload filled out I-983 form"
                  : `Upload ${data.currentDocumentName}`}
              </Form.Label>

              <Form.Control
                type="file"
                accept=".pdf,image/*"
                onChange={(event) => setFile(event.target.files[0])}
              />
            </Form.Group>

            <Button type="button" variant="primary" onClick={handleUpload}>
              Upload
            </Button>
          </Card.Body>
        </Card>
      )}
    </Layout>
  );
}

function StepBadge({ status }) {
  if (status === "completed") {
    return <Badge bg="success">Completed</Badge>;
  }

  if (status === "pending_review") {
    return (
      <Badge bg="warning" text="dark">
        Pending
      </Badge>
    );
  }

  if (status === "rejected") {
    return <Badge bg="danger">Rejected</Badge>;
  }

  if (status === "current") {
    return <Badge bg="primary">Current</Badge>;
  }

  return <Badge bg="secondary">Not Started</Badge>;
}