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
    <div className="min-vh-100 d-flex flex-column">
      <Header />

      <main className="flex-grow-1">
        <Container fluid className="py-4">
          {children}
        </Container>
      </main>

      <Footer />
    </div>
  );
}