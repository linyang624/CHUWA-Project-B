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
    <Card className="mb-4">
      <Card.Body>
        <Card.Title>Generate Registration Token</Card.Title>

        <Form onSubmit={handleSubmit}>
          <Row className="g-3">
            <Col xs={12} md={4}>
              <Form.Group>
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  placeholder="employee@example.com"
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>

            <Col xs={12} md={4}>
              <Form.Group>
                <Form.Label>First Name</Form.Label>
                <Form.Control
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  placeholder="First name"
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>

            <Col xs={12} md={4}>
              <Form.Group>
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  placeholder="Last name"
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <div className="mt-3">
            <Button type="submit" disabled={loading}>
              {loading ? "Generating..." : "Generate token and send email"}
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
}