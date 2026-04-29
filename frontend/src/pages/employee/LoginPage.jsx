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

  const handleLogin = async (event) => {
    event.preventDefault();
    setError("");

    try {
      const data = await loginUser({ username, password });

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

      // HR should go to HR dashboard
      if (user.role === "hr") {
        navigate("/hr/home");
        return;
      }

      // Employee goes based on onboarding status
      if (data.onboardingStatus === "approved") {
        navigate("/personal-info");
      } else {
        navigate("/onboarding");
      }
    } catch (err) {
      setError(err.message || "Login failed");
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light px-3">
      <Card className="w-100 shadow-sm" style={{ maxWidth: "520px" }}>
        <Card.Body className="p-4">
          <h1 className="h3 mb-4">Login Page</h1>

          {error && (
            <Alert variant="danger" className="mb-3">
              {error}
            </Alert>
          )}

          <Form onSubmit={handleLogin}>
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