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
    <Container className="py-5">
      <div className="text-center">
        <h2>{title}</h2>
        <p>{message}</p>
        <Button onClick={handleGoHome}>Go Home</Button>
      </div>
    </Container>
  );
}