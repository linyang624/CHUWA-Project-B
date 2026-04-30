import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import Layout from "../../components/common/Layout";
import Loading from "../../components/common/Loading";
import Message from "../../components/common/Message";
import RegistrationTokenForm from "../../components/hr/RegistrationTokenForm";
import RegistrationTokenTable from "../../components/hr/RegistrationTokenTable";

import {
  clearHrError,
  clearHrSuccessMessage,
  fetchRegistrationTokenHistory,
  generateRegistrationToken,
} from "../../features/hr/hrSlice";

/*
  RegistrationTokenPage

  This page is used by HR to:
  1. generate registration token for a new employee
  2. view registration token sending history

  Flow:
  - HR fills email, firstName, lastName
  - HR clicks generate token and send email
  - backend creates token and sends email
  - frontend refreshes token history

  Responsive:
  - Form fields are responsive inside RegistrationTokenForm
  - Token table is responsive inside RegistrationTzokenTable
*/
export default function RegistrationTokenPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { registrationTokens, loading, error, successMessage } = useSelector(
    (state) => state.hr
  );

  /*
    Load token history when page opens.
  */
  useEffect(() => {
    dispatch(fetchRegistrationTokenHistory());

    return () => {
      dispatch(clearHrError());
      dispatch(clearHrSuccessMessage());
    };
  }, [dispatch]);

  /*
    Generate token, then refresh token history.
  */
  const handleGenerateToken = async (formData) => {
    try {
      await dispatch(generateRegistrationToken(formData)).unwrap();
      dispatch(fetchRegistrationTokenHistory());
    } catch (error) {
      console.error("Failed to generate registration token:", error);
    }
  };

  return (
    <Layout>
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h1
            className="mb-1"
            style={{
              color: "#1f2937",
              fontSize: "clamp(30px, 4vw, 42px)",
              fontWeight: "900",
              letterSpacing: "-0.055em",
              lineHeight: "1.08",
            }}
          >
            Registration Token
          </h1>

          <p
            className="mb-0"
            style={{
              color: "#6b7280",
              fontSize: "15px",
              fontWeight: "600",
              lineHeight: "1.6",
            }}
          >
            Generate employee registration links and review token history.
          </p>
        </div>

        <Button
          variant="outline-secondary"
          onClick={() => navigate("/hr/hiring-management")}
          style={outlineSecondaryButtonStyle}
        >
          Back to Hiring Management
        </Button>
      </div>

      {error && <Message variant="danger">{error}</Message>}
      {successMessage && <Message variant="success">{successMessage}</Message>}

      <RegistrationTokenForm
        loading={loading}
        onSubmit={handleGenerateToken}
      />

      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-2 mb-3">
        <div>
          <h2
            className="mb-1"
            style={{
              color: "#1f2937",
              fontSize: "24px",
              fontWeight: "900",
              letterSpacing: "-0.045em",
              lineHeight: "1.15",
            }}
          >
            Token History
          </h2>

          <p
            className="mb-0"
            style={{
              color: "#6b7280",
              fontSize: "14px",
              fontWeight: "600",
              lineHeight: "1.5",
            }}
          >
            View sent registration links and onboarding submission status.
          </p>
        </div>

        {!loading && (
          <div
            className="d-inline-flex align-items-center"
            style={{
              padding: "7px 12px",
              borderRadius: "999px",
              background: "#eef2ff",
              color: "#4f46e5",
              fontSize: "12px",
              fontWeight: "800",
              whiteSpace: "nowrap",
            }}
          >
            Total Tokens: {registrationTokens.length}
          </div>
        )}
      </div>

      {loading ? (
        <Loading text="Loading registration tokens..." />
      ) : (
        <RegistrationTokenTable tokens={registrationTokens} />
      )}
    </Layout>
  );
}

const outlineSecondaryButtonStyle = {
  borderRadius: "999px",
  borderColor: "#d8dee8",
  color: "#374151",
  background: "#ffffff",
  fontSize: "13px",
  fontWeight: "800",
  padding: "8px 16px",
  boxShadow: "0 4px 12px rgba(15, 23, 42, 0.06)",
  whiteSpace: "nowrap",
};