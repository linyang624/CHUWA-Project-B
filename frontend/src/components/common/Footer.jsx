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
    <footer className="border-top mt-auto py-3">
      <Container
        fluid
        className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3"
      >
        <div>©2026 Chuwa. All Rights Reserved.</div>

        <div className="d-flex align-items-center gap-3">
          <FaLinkedinIn />
          <FaTwitter />
          <FaFacebookF />
        </div>

        <div className="d-flex align-items-center gap-3">
          <span>Contact us</span>
          <span>Privacy Policies</span>
          <span>Help</span>
        </div>
      </Container>
    </footer>
  );
}