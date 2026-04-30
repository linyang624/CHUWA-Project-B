import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Container, Nav, Navbar, Button } from "react-bootstrap";

import { logout } from "../../features/auth/authSlice";

/*
  Header component

  Shared navigation bar for logged-in HR and employee users.

  Rules:
  - Not logged in: Header is not shown.
  - HR logged in: show full HR navbar.
  - Employee logged in and onboarding approved:
    show Personal Information and Visa Status links.
  - Employee logged in but onboarding not approved:
    hide Personal Information and Visa Status links.
    company name is not clickable, so user stays on onboarding / pending page.

  Responsive:
  - On medium and large screens, nav links show in one row.
  - On small screens, nav links collapse into a hamburger menu.
*/
export default function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const onboardingStatus = user?.onboardingStatus || "never_submitted";
  const isHr = user?.role === "hr";
  const isEmployee = user?.role === "employee";
  const isApprovedEmployee = isEmployee && onboardingStatus === "approved";

  /*
    Decide where the brand should go when clicked.

    HR:
    - brand goes to HR home.

    Approved employee:
    - brand goes to Personal Information.

    Employee not approved:
    - brand should not navigate anywhere.
  */
  const getHomePath = () => {
    if (isHr) {
      return "/hr/home";
    }

    if (isApprovedEmployee) {
      return "/personal-info";
    }

    return null;
  };

  /*
    Logout clears auth state and localStorage, then sends user back to login.
  */
  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  /*
    HR navigation links.
    HR always sees the full navbar after login.
  */
  const renderHrLinks = () => {
    return (
      <>
        <Nav.Link as={NavLink} to="/hr/home" className="chuwa-nav-link">
          Home
        </Nav.Link>

        <Nav.Link
          as={NavLink}
          to="/hr/employee-profiles"
          className="chuwa-nav-link"
        >
          Employee Profiles
        </Nav.Link>

        <Nav.Link
          as={NavLink}
          to="/hr/visa-status-management"
          className="chuwa-nav-link"
        >
          Visa Status Management
        </Nav.Link>

        <Nav.Link
          as={NavLink}
          to="/hr/hiring-management"
          className="chuwa-nav-link"
        >
          Hiring Management
        </Nav.Link>
      </>
    );
  };

  /*
    Employee navigation links.

    Before onboarding is approved:
    - do not show Personal Information
    - do not show Visa Status

    After onboarding is approved:
    - show both links.
  */
  const renderEmployeeLinks = () => {
    if (!isApprovedEmployee) {
      return null;
    }

    return (
      <>
        <Nav.Link as={NavLink} to="/personal-info" className="chuwa-nav-link">
          Personal Information
        </Nav.Link>

        <Nav.Link as={NavLink} to="/visa-status" className="chuwa-nav-link">
          Visa Status
        </Nav.Link>
      </>
    );
  };

  /*
    Login and registration pages should not use Layout,
    so normally Header only appears after login.
  */
  if (!isAuthenticated) {
    return null;
  }

  const homePath = getHomePath();

  const brandContent = (
    <div className="d-flex align-items-center gap-2">
      <div
        className="d-flex align-items-center justify-content-center"
        style={{
          width: "82px",
          height: "40px",
          borderRadius: "14px",
          background: "linear-gradient(135deg, #2563eb, #7c3aed)",
          color: "#ffffff",
          fontWeight: "800",
          fontSize: "16px",
          letterSpacing: "-0.03em",
          boxShadow: "0 8px 18px rgba(79, 70, 229, 0.22)",
        }}
      >
        Chuwa
      </div>

      <span
        className="d-none d-sm-inline"
        style={{
          color: "#1f2937",
          fontWeight: "800",
          fontSize: "17px",
          letterSpacing: "-0.03em",
        }}
      >
        Employee Management
      </span>
    </div>
  );

  return (
    <>
      <Navbar
        expand="md"
        className="border-bottom"
        style={{
          background: "rgba(255, 255, 255, 0.92)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          borderColor: "#e5e7eb",
          minHeight: "72px",
          boxShadow: "0 4px 18px rgba(15, 23, 42, 0.04)",
          fontFamily:
            "Arial, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        }}
      >
        <Container fluid className="px-3 px-md-4">
          {homePath ? (
            <Navbar.Brand
              as={Link}
              to={homePath}
              className="me-3 py-0"
              style={{
                textDecoration: "none",
              }}
            >
              {brandContent}
            </Navbar.Brand>
          ) : (
            <Navbar.Brand
              className="me-3 py-0"
              style={{
                cursor: "default",
              }}
            >
              {brandContent}
            </Navbar.Brand>
          )}

          <Navbar.Toggle
            aria-controls="main-navbar-nav"
            style={{
              border: "1px solid #d8dee8",
              borderRadius: "12px",
              padding: "6px 9px",
              boxShadow: "none",
            }}
          />

          <Navbar.Collapse id="main-navbar-nav">
            <Nav className="me-auto align-items-md-center mt-3 mt-md-0 gap-md-1">
              {isHr && renderHrLinks()}
              {isEmployee && renderEmployeeLinks()}
            </Nav>

            <div className="d-flex align-items-center gap-2 mt-3 mt-md-0">
              <div
                className="d-flex align-items-center justify-content-center"
                style={{
                  width: "34px",
                  height: "34px",
                  borderRadius: "50%",
                  background: "#eef2ff",
                  color: "#4f46e5",
                  fontSize: "14px",
                  fontWeight: "800",
                  flexShrink: 0,
                }}
              >
                {(user?.username || "U").charAt(0).toUpperCase()}
              </div>

              <span
                className="text-truncate"
                style={{
                  maxWidth: "150px",
                  color: "#374151",
                  fontWeight: "700",
                  fontSize: "14px",
                }}
              >
                {user?.username}
              </span>

              <Button
                variant="outline-secondary"
                size="sm"
                onClick={handleLogout}
                style={{
                  borderRadius: "999px",
                  padding: "6px 14px",
                  fontWeight: "700",
                  fontSize: "13px",
                  borderColor: "#d8dee8",
                  color: "#374151",
                  background: "#ffffff",
                }}
              >
                Logout
              </Button>
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <style>
        {`
          .chuwa-nav-link {
            color: #4b5563 !important;
            font-weight: 700 !important;
            font-size: 14px !important;
            padding: 8px 12px !important;
            border-radius: 999px !important;
            transition: all 0.18s ease;
          }

          .chuwa-nav-link:hover {
            color: #4f46e5 !important;
            background: #eef2ff !important;
          }

          .chuwa-nav-link.active {
            color: #4f46e5 !important;
            background: #eef2ff !important;
          }

          @media (max-width: 767px) {
            .chuwa-nav-link {
              border-radius: 12px !important;
              padding: 10px 12px !important;
            }
          }
        `}
      </style>
    </>
  );
}