import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button, Container } from "react-bootstrap";

/*
  ErrorPage handles business or access errors.

  Example:
  - invalid registration token
  - expired registration link
  - access denied
  - not found page
  - this feature does not apply to this user
*/
export default function ErrorPage({
  title = "Oops, something went wrong!",
  message = "Please check your link or contact HR for help.",
}) {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  /*
    Go Home logic:
    - not logged in -> login page
    - HR -> HR homepage
    - employee -> temporary employee homepage

    Employee homepage may change later.
  */
  const handleGoHome = () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (user?.role === "hr") {
      navigate("/hr/home");
      return;
    }

    if (user?.role === "employee") {
      navigate("/personal-info");
      return;
    }

    navigate("/login");
  };

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
              background: "#eef2ff",
              color: "#4f46e5",
              fontSize: "34px",
              fontWeight: "900",
            }}
          >
            ?
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
            {title}
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
            {message}
          </p>

          <Button
            variant="primary"
            onClick={handleGoHome}
            className="fw-bold px-4 py-2"
            style={{
              fontSize: "14px",
            }}
          >
            Go Home
          </Button>
        </div>
      </Container>
    </div>
  );
}