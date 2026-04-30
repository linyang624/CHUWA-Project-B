import { useState } from "react";
import { Button, Card, Col, Form, Row } from "react-bootstrap";

/*
  RegistrationTokenForm

  Used by HR to generate a registration token for a new employee.

  Fields:
  - email
  - firstName
  - lastName

  Responsive:
  - On small screens, fields stack vertically.
  - On medium and larger screens, fields can appear in one row.
*/
export default function RegistrationTokenForm({ loading = false, onSubmit }) {
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    onSubmit({
      email: formData.email.trim(),
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
    });
  };

  return (
    <Card
      className="mb-4 border-0"
      style={{
        borderRadius: "20px",
        boxShadow: "0 10px 24px rgba(15, 23, 42, 0.05)",
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
            fontWeight: "800",
            letterSpacing: "-0.04em",
          }}
        >
          Generate Registration Token
        </Card.Title>

        <Form onSubmit={handleSubmit}>
          <Row className="g-3">
            <Col xs={12} md={4}>
              <Form.Group>
                <Form.Label
                  style={{
                    color: "#374151",
                    fontSize: "14px",
                    fontWeight: "800",
                    marginBottom: "8px",
                  }}
                >
                  Email
                </Form.Label>

                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  placeholder="employee@example.com"
                  onChange={handleChange}
                  required
                  style={{
                    height: "48px",
                    borderRadius: "14px",
                    border: "1px solid #d8dee8",
                    fontSize: "14px",
                    fontWeight: "500",
                    paddingLeft: "14px",
                  }}
                />
              </Form.Group>
            </Col>

            <Col xs={12} md={4}>
              <Form.Group>
                <Form.Label
                  style={{
                    color: "#374151",
                    fontSize: "14px",
                    fontWeight: "800",
                    marginBottom: "8px",
                  }}
                >
                  First Name
                </Form.Label>

                <Form.Control
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  placeholder="First name"
                  onChange={handleChange}
                  required
                  style={{
                    height: "48px",
                    borderRadius: "14px",
                    border: "1px solid #d8dee8",
                    fontSize: "14px",
                    fontWeight: "500",
                    paddingLeft: "14px",
                  }}
                />
              </Form.Group>
            </Col>

            <Col xs={12} md={4}>
              <Form.Group>
                <Form.Label
                  style={{
                    color: "#374151",
                    fontSize: "14px",
                    fontWeight: "800",
                    marginBottom: "8px",
                  }}
                >
                  Last Name
                </Form.Label>

                <Form.Control
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  placeholder="Last name"
                  onChange={handleChange}
                  required
                  style={{
                    height: "48px",
                    borderRadius: "14px",
                    border: "1px solid #d8dee8",
                    fontSize: "14px",
                    fontWeight: "500",
                    paddingLeft: "14px",
                  }}
                />
              </Form.Group>
            </Col>
          </Row>

          <div className="mt-4">
            <Button
              type="submit"
              variant="primary"
              disabled={loading}
              className="fw-bold px-4 py-2"
            >
              {loading ? "Generating..." : "Generate token and send email"}
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
}