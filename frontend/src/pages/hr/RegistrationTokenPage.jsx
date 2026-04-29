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
  - Token table is responsive inside RegistrationTokenTable
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
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-2 mb-4">
        <h1 className="mb-0">Registration Token</h1>

        <Button
          variant="outline-secondary"
          onClick={() => navigate("/hr/hiring-management")}
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

      <h2 className="mb-3">Token History</h2>

      {loading ? (
        <Loading text="Loading registration tokens..." />
      ) : (
        <RegistrationTokenTable tokens={registrationTokens} />
      )}
    </Layout>
  );
}