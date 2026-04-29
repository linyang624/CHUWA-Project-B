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
        <Container className="py-5">
          <div className="text-center">
            <h2>Oops, something went wrong!</h2>
            <p>Please check your link or contact HR for help.</p>
            <Button onClick={this.handleGoHome}>Go Home</Button>
          </div>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;