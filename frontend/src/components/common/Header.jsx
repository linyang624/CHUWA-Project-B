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
        <Nav.Link as={NavLink} to="/hr/home">
          Home
        </Nav.Link>

        <Nav.Link as={NavLink} to="/hr/employee-profiles">
          Employee Profiles
        </Nav.Link>

        <Nav.Link as={NavLink} to="/hr/visa-status-management">
          Visa Status Management
        </Nav.Link>

        <Nav.Link as={NavLink} to="/hr/hiring-management">
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
        <Nav.Link as={NavLink} to="/personal-info">
          Personal Information
        </Nav.Link>

        <Nav.Link as={NavLink} to="/visa-status">
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

  return (
    <Navbar expand="md" bg="light" className="border-bottom">
      <Container fluid>
        {/* 
          Brand / company name.

          If homePath exists, it is clickable.
          If homePath is null, it becomes plain text and does not navigate.
        */}
        {homePath ? (
          <Navbar.Brand as={Link} to={homePath}>
            Chuwa Employee Management
          </Navbar.Brand>
        ) : (
          <Navbar.Brand style={{ cursor: "default" }}>
            Chuwa Employee Management
          </Navbar.Brand>
        )}

        <Navbar.Toggle aria-controls="main-navbar-nav" />

        <Navbar.Collapse id="main-navbar-nav">
          <Nav className="me-auto">
            {isHr && renderHrLinks()}
            {isEmployee && renderEmployeeLinks()}
          </Nav>

          <div className="d-flex align-items-center gap-2 mt-3 mt-md-0">
            <span>{user?.username}</span>

            <Button variant="outline-secondary" size="sm" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}