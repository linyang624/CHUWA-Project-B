import { Container } from "react-bootstrap";

import Header from "./Header";
import Footer from "./Footer";

/*
  Layout component

  Shared page shell for logged-in HR and employee pages.

  It contains:
  - Header
  - main content area
  - Footer
*/
export default function Layout({ children }) {
  return (
    <div
      className="min-vh-100 d-flex flex-column"
      style={{
        background:
          "linear-gradient(135deg, #f8fafc 0%, #eef2ff 45%, #f8fafc 100%)",
        fontFamily:
          "Arial, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >
      <Header />

      <main className="flex-grow-1">
        <Container fluid className="py-4 px-3 px-md-4">
          {children}
        </Container>
      </main>

      <Footer />
    </div>
  );
}