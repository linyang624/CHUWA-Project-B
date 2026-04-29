import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Container, Nav, Navbar, Button } from "react-bootstrap";

import { logout } from "../../features/auth/authSlice";

/*
  Header component

  Shared navigation bar for logged-in HR and employee users.

  HR sees:
  - Home
  - Employee Profiles
  - Visa Status Management
  - Hiring Management
  - Logout

  Employee sees:
  - Personal Information
  - Visa Status Management
  - Logout

  Responsive:
  - On medium and large screens, nav links show in one row.
  - On small screens, nav links collapse into a hamburger menu.
*/
export default function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isAuthenticated, user } = useSelector((state) => state.auth);

  /*
    Decide where the brand should go when clicked.
    HR goes to HR home.
    Employee goes to Personal Information because employee does not need a homepage.
    Unknown state goes to login.
  */
  const getHomePath = () => {
    if (user?.role === "hr") {
      return "/hr/home";
    }

    if (user?.role === "employee") {
      return "/personal-info";
    }

    return "/login";
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
    Registration and onboarding are not shown here because:
    - registration is only through token link
    - onboarding is only shown before approval
    - approved employees normally use Personal Information as their main page
  */
  const renderEmployeeLinks = () => {
    return (
      <>
        <Nav.Link as={NavLink} to="/personal-info">
          Personal Information
        </Nav.Link>

        <Nav.Link as={NavLink} to="/employee/visa-status-management">
          Visa Status Management
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

  return (
    <Navbar expand="md" bg="light" className="border-bottom">
      <Container fluid>
        <Navbar.Brand as={Link} to={getHomePath()}>
          Chuwa Employee Management
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="main-navbar-nav" />

        <Navbar.Collapse id="main-navbar-nav">
          <Nav className="me-auto">
            {user?.role === "hr" && renderHrLinks()}
            {user?.role === "employee" && renderEmployeeLinks()}
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