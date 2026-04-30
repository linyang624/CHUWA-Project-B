import React from "react";
import { Button, Container } from "react-bootstrap";

/*
  ErrorBoundary catches frontend render errors.
  It prevents the whole app from becoming a blank white page.

  Note:
  React ErrorBoundary must be a class component.
  This is a special React rule.
*/
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hasError: false,
    };
  }

  /*
    When a child component crashes, show fallback UI.
  */
  static getDerivedStateFromError() {
    return {
      hasError: true,
    };
  }

  /*
    Log render error for debugging.
  */
  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  /*
    Go back to login as a safe fallback.
    ErrorBoundary cannot easily use Redux hooks because it is a class component.
  */
  handleGoHome = () => {
    window.location.href = "/login";
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          className="min-vh-100 d-flex align-items-center justify-content-center px-3"
          style={{
            background:
              "linear-gradient(135deg, #f8fafc 0%, #eef2ff 45%, #f8fafc 100%)",
            fontFamily:
              "Arial, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
          }}
        >
          <Container
            className="d-flex justify-content-center"
            style={{ maxWidth: "720px" }}
          >
            <div
              className="text-center w-100"
              style={{
                background: "#ffffff",
                border: "1px solid #e5e7eb",
                borderRadius: "24px",
                padding: "42px 28px",
                boxShadow: "0 18px 45px rgba(15, 23, 42, 0.08)",
              }}
            >
              <div
                className="d-inline-flex align-items-center justify-content-center mb-4"
                style={{
                  width: "72px",
                  height: "72px",
                  borderRadius: "22px",
                  background: "#fef2f2",
                  color: "#dc2626",
                  fontSize: "34px",
                  fontWeight: "900",
                }}
              >
                !
              </div>

              <h2
                className="mb-3"
                style={{
                  color: "#1f2937",
                  fontSize: "clamp(28px, 4vw, 40px)",
                  fontWeight: "900",
                  letterSpacing: "-0.055em",
                  lineHeight: "1.08",
                }}
              >
                Oops, something went wrong!
              </h2>

              <p
                className="mb-4"
                style={{
                  color: "#6b7280",
                  fontSize: "15px",
                  fontWeight: "600",
                  lineHeight: "1.6",
                }}
              >
                Please check your link or contact HR for help.
              </p>

              <Button
                variant="primary"
                onClick={this.handleGoHome}
                className="fw-bold px-4 py-2"
              >
                Go Home
              </Button>
            </div>
          </Container>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;