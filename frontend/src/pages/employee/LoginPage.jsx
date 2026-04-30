import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Alert, Button, Card, Col, Form, Row } from "react-bootstrap";

import { loginSuccess } from "../../features/auth/authSlice";
import { loginUser } from "../../api/authApi";

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  /*
    Shared login page for both HR and employee.
    The backend role decides where the user goes after login.
  */
  const handleLogin = async (event) => {
    event.preventDefault();
    setError("");

    if (!username.trim() || !password.trim()) {
      setError("Please enter both username and password.");
      return;
    }

    try {
      const data = await loginUser({
        username: username.trim(),
        password,
      });

      const user = {
        id: data.id,
        username: data.username,
        email: data.email,
        role: data.role,
        onboardingStatus: data.onboardingStatus || "never_submitted",
      };

      dispatch(
        loginSuccess({
          user,
          token: data.token,
        })
      );

      if (user.role === "hr") {
        navigate("/hr/home");
        return;
      }

      if (user.onboardingStatus === "approved") {
        navigate("/personal-info");
        return;
      }

      navigate("/onboarding");
    } catch (err) {
      setError(
        "The username or password may be incorrect. Please check your information and try again."
      );
    }
  };

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
                fontSize: "clamp(32px, 5vw, 32px)",
                fontWeight: "800",
                color: "#1f2937",
                letterSpacing: "-0.055em",
                lineHeight: "1.08",
              }}
            >
              Employee Management System
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

          <Form onSubmit={handleLogin}>
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
                    Password
                  </Form.Label>

                  <Form.Control
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Enter password"
                    autoComplete="current-password"
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
                  className="w-100 mt-2"
                  style={{
                    height: "52px",
                    borderRadius: "14px",
                    border: "none",
                    background: "linear-gradient(135deg, #2563eb, #4f46e5)",
                    fontWeight: "700",
                    fontSize: "16px",
                    boxShadow: "0 10px 18px rgba(37, 99, 235, 0.22)",
                  }}
                >
                  Login
                </Button>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
}