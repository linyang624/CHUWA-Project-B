import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Alert, Button, Card, Col, Form, Row } from "react-bootstrap";

import {
  verifyRegistrationToken,
  registerWithToken,
} from "../../api/registrationApi";
import Loading from "../../components/common/Loading";

export default function RegisterPage() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /*
    Verify the registration token when the page opens.

    Possible invalid cases:
    - token does not exist
    - token expired
    - token already used
  */
  useEffect(() => {
    const checkToken = async () => {
      try {
        const data = await verifyRegistrationToken(token);
        setEmail(data.email);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    checkToken();
  }, [token]);

  /*
    Register employee account using the valid token.
  */
  const handleRegister = async (event) => {
    event.preventDefault();
    setError("");

    if (!username || !password) {
      setError("Please fill in all required fields.");
      return;
    }

    try {
      await registerWithToken(token, {
        username,
        password,
      });

      navigate("/login");
    } catch (err) {
      setError(err.message);
    }
  };

  /*
    Decide what helper text to show when token verification fails.
  */
  const getTokenErrorHelpText = () => {
    const lowerError = error.toLowerCase();

    if (lowerError.includes("already used")) {
      return "This registration link has already been used. Please go to the login page and sign in with your account.";
    }

    if (lowerError.includes("expired")) {
      return "This registration link has expired. Please contact HR to request a new registration link.";
    }

    return "This registration link is invalid. Please contact HR to request a new registration link.";
  };

  const shouldShowLoginButton = () => {
    const lowerError = error.toLowerCase();

    return (
      lowerError.includes("already used") ||
      lowerError.includes("expired") ||
      lowerError.includes("invalid")
    );
  };

  if (loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light px-3">
        <Card className="w-100 shadow-sm" style={{ maxWidth: "520px" }}>
          <Card.Body className="p-4">
            <Loading text="Checking registration token..." />
          </Card.Body>
        </Card>
      </div>
    );
  }

  /*
    Token verification failed before we got an invited email.
    This means the user cannot register with this link.
  */
  if (error && !email) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light px-3">
        <Card className="w-100 shadow-sm" style={{ maxWidth: "560px" }}>
          <Card.Body className="p-4">
            <h1 className="h3 mb-3">Registration Page</h1>

            <Alert variant="danger" className="mb-3">
              {getTokenErrorHelpText()}
            </Alert>

            {shouldShowLoginButton() && (
              <Button
                type="button"
                variant="primary"
                className="w-100"
                onClick={() => navigate("/login")}
              >
                Go to Login
              </Button>
            )}
          </Card.Body>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light px-3">
      <Card className="w-100 shadow-sm" style={{ maxWidth: "560px" }}>
        <Card.Body className="p-4">
          <h1 className="h3 mb-2">Registration Page</h1>

          <p className="text-muted mb-4">
            Create your employee account using the email address invited by HR.
          </p>

          {error && (
            <Alert variant="danger" className="mb-3">
              {error}
            </Alert>
          )}

          <Form onSubmit={handleRegister}>
            <Row className="g-3">
              <Col xs={12}>
                <Form.Group>
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                    placeholder="Enter username"
                  />
                </Form.Group>
              </Col>

              <Col xs={12}>
                <Form.Group>
                  <Form.Label>Email</Form.Label>
                  <Form.Control value={email} disabled readOnly />
                </Form.Group>
              </Col>

              <Col xs={12}>
                <Form.Group>
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Enter password"
                  />
                </Form.Group>
              </Col>

              <Col xs={12}>
                <Button type="submit" variant="primary" className="w-100">
                  Register
                </Button>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
}