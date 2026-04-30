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
    Verify registration token before showing the form.
  */
  useEffect(() => {
    const checkToken = async () => {
      try {
        const data = await verifyRegistrationToken(token);
        setEmail(data.email);
      } catch (err) {
        setError(err.message || "Invalid registration link.");
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

    if (!username.trim() || !password.trim()) {
      setError("Please fill in all required fields.");
      return;
    }

    try {
      await registerWithToken(token, {
        username: username.trim(),
        password,
      });

      navigate("/login");
    } catch (err) {
      setError(err.message || "Registration failed.");
    }
  };

  const getTokenErrorTitle = () => {
    const lowerError = error.toLowerCase();

    if (lowerError.includes("already used")) {
      return "Registration Link Used";
    }

    if (lowerError.includes("expired")) {
      return "Registration Link Expired";
    }

    return "Invalid Registration Link";
  };

  const getTokenErrorHelpText = () => {
    const lowerError = error.toLowerCase();

    if (lowerError.includes("already used")) {
      return "This registration link has already been used.";
    }

    if (lowerError.includes("expired")) {
      return "This registration link has expired.";
    }

    return "This registration link is invalid.";
  };

  if (loading) {
    return (
      <div
        className="min-vh-100 d-flex align-items-center justify-content-center px-3 px-sm-4"
        style={{
          background:
            "linear-gradient(135deg, #f6f8fc 0%, #eef2ff 45%, #f8fafc 100%)",
          fontFamily:
            "Arial, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        }}
      >
        <Card
          className="w-100 border-0 shadow-lg"
          style={{
            maxWidth: "520px",
            borderRadius: "24px",
          }}
        >
          <Card.Body className="p-4 p-sm-5">
            <Loading text="Loading..." />
          </Card.Body>
        </Card>
      </div>
    );
  }

  /*
    Token verification failed before loading email.
  */
  if (error && !email) {
    return (
      <div
        className="min-vh-100 d-flex align-items-center justify-content-center px-3 px-sm-4"
        style={{
          background:
            "linear-gradient(135deg, #f6f8fc 0%, #eef2ff 45%, #f8fafc 100%)",
          fontFamily:
            "Arial, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        }}
      >
        <Card
          className="w-100 border-0 shadow-lg"
          style={{
            maxWidth: "620px",
            borderRadius: "24px",
            overflow: "hidden",
          }}
        >
          <Card.Body className="p-4 p-sm-5">
            <div
              className="d-inline-flex align-items-center justify-content-center mb-4"
              style={{
                width: "92px",
                height: "54px",
                borderRadius: "18px",
                background: "linear-gradient(135deg, #2563eb, #7c3aed)",
                color: "#ffffff",
                fontSize: "18px",
                fontWeight: "800",
                letterSpacing: "-0.03em",
              }}
            >
              Chuwa
            </div>

            <h1
              className="mb-4"
              style={{
                fontSize: "clamp(30px, 4vw, 42px)",
                fontWeight: "800",
                color: "#1f2937",
                letterSpacing: "-0.05em",
                lineHeight: "1.1",
              }}
            >
              {getTokenErrorTitle()}
            </h1>

            <Alert
              variant="danger"
              className="mb-4"
              style={{
                borderRadius: "14px",
                fontSize: "15px",
                lineHeight: "1.6",
              }}
            >
              {getTokenErrorHelpText()}
            </Alert>

            <Button
              type="button"
              variant="primary"
              className="w-100 fw-bold"
              onClick={() => navigate("/login")}
              style={{
                height: "52px",
                fontSize: "16px",
              }}
            >
              Go to Login
            </Button>
          </Card.Body>
        </Card>
      </div>
    );
  }

  return (
    <div
      className="min-vh-100 d-flex align-items-center justify-content-center px-3 px-sm-4"
      style={{
        background:
          "linear-gradient(135deg, #f6f8fc 0%, #eef2ff 45%, #f8fafc 100%)",
        fontFamily:
          "Arial, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >
      <Card
        className="w-100 border-0 shadow-lg"
        style={{
          maxWidth: "560px",
          borderRadius: "24px",
          overflow: "hidden",
        }}
      >
        <Card.Body className="p-4 p-sm-5">
          <div className="mb-4">
            <div
              className="d-inline-flex align-items-center justify-content-center mb-4"
              style={{
                width: "92px",
                height: "54px",
                borderRadius: "18px",
                background: "linear-gradient(135deg, #2563eb, #7c3aed)",
                color: "#ffffff",
                fontSize: "18px",
                fontWeight: "800",
                letterSpacing: "-0.03em",
              }}
            >
              Chuwa
            </div>

            <h1
              className="mb-0"
              style={{
                fontSize: "clamp(40px, 5vw, 40px)",
                fontWeight: "800",
                color: "#1f2937",
                letterSpacing: "-0.055em",
                lineHeight: "1.08",
              }}
            >
              Create Employee Account
            </h1>
          </div>

          {error && (
            <Alert
              variant="danger"
              className="mb-4"
              style={{
                borderRadius: "14px",
                fontSize: "14px",
                lineHeight: "1.5",
              }}
            >
              {error}
            </Alert>
          )}

          <Form onSubmit={handleRegister}>
            <Row className="g-3">
              <Col xs={12}>
                <Form.Group>
                  <Form.Label
                    className="mb-2"
                    style={{
                      fontWeight: "700",
                      color: "#374151",
                      fontSize: "14px",
                    }}
                  >
                    Username
                  </Form.Label>

                  <Form.Control
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                    placeholder="Enter username"
                    autoComplete="username"
                    style={{
                      height: "50px",
                      borderRadius: "14px",
                      border: "1px solid #d8dee8",
                      fontSize: "15px",
                      paddingLeft: "15px",
                    }}
                  />
                </Form.Group>
              </Col>

              <Col xs={12}>
                <Form.Group>
                  <Form.Label
                    className="mb-2"
                    style={{
                      fontWeight: "700",
                      color: "#374151",
                      fontSize: "14px",
                    }}
                  >
                    Email
                  </Form.Label>

                  <Form.Control
                    value={email}
                    disabled
                    readOnly
                    style={{
                      height: "50px",
                      borderRadius: "14px",
                      border: "1px solid #d8dee8",
                      fontSize: "15px",
                      paddingLeft: "15px",
                      backgroundColor: "#eef2f7",
                      color: "#4b5563",
                    }}
                  />
                </Form.Group>
              </Col>

              <Col xs={12}>
                <Form.Group>
                  <Form.Label
                    className="mb-2"
                    style={{
                      fontWeight: "700",
                      color: "#374151",
                      fontSize: "14px",
                    }}
                  >
                    Password
                  </Form.Label>

                  <Form.Control
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Enter password"
                    autoComplete="new-password"
                    style={{
                      height: "50px",
                      borderRadius: "14px",
                      border: "1px solid #d8dee8",
                      fontSize: "15px",
                      paddingLeft: "15px",
                    }}
                  />
                </Form.Group>
              </Col>

              <Col xs={12}>
                <Button
                  type="submit"
                  variant="primary"
                  className="w-100 mt-2 fw-bold"
                  style={{
                    height: "52px",
                    fontSize: "16px",
                  }}
                >
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