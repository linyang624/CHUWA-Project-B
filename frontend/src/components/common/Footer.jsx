import { Container } from "react-bootstrap";
import { FaLinkedinIn, FaTwitter, FaFacebookF } from "react-icons/fa";

/*
  Footer component

  Shared simple footer for logged-in pages.

  Responsive:
  - Desktop: left copyright, middle icons, right links
  - Mobile: stacked vertically
*/
export default function Footer() {
  return (
    <footer
      className="mt-auto"
      style={{
        background: "#ffffff",
        borderTop: "1px solid #e5e7eb",
        fontFamily:
          "Arial, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >
      <Container
        fluid
        className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3 px-3 px-md-4"
        style={{
          minHeight: "72px",
          color: "#6b7280",
          fontSize: "13px",
        }}
      >
        <div style={{ fontWeight: "600" }}>
          ©2026 Chuwa. All Rights Reserved.
        </div>

        <div className="d-flex align-items-center gap-3">
          <span
            className="d-flex align-items-center justify-content-center"
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              background: "#f3f4f6",
              color: "#4b5563",
            }}
          >
            <FaLinkedinIn />
          </span>

          <span
            className="d-flex align-items-center justify-content-center"
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              background: "#f3f4f6",
              color: "#4b5563",
            }}
          >
            <FaTwitter />
          </span>

          <span
            className="d-flex align-items-center justify-content-center"
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              background: "#f3f4f6",
              color: "#4b5563",
            }}
          >
            <FaFacebookF />
          </span>
        </div>

        <div
          className="d-flex align-items-center gap-3 flex-wrap justify-content-center"
          style={{
            fontWeight: "600",
          }}
        >
          <span>Contact</span>
          <span>Privacy</span>
          <span>Help</span>
        </div>
      </Container>
    </footer>
  );
}