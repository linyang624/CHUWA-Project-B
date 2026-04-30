import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";

import Layout from "../../components/common/Layout";
import Loading from "../../components/common/Loading";
import Message from "../../components/common/Message";
import EmployeeProfileDetail from "../../components/hr/EmployeeProfileDetail";

import {
  clearHrError,
  clearSelectedEmployee,
  fetchEmployeeById,
} from "../../features/hr/hrSlice";

/*
  EmployeeDetailPage

  HR can view one employee's full profile.

  This page is opened when HR clicks Legal Full Name
  in EmployeeProfilesPage.

  Responsive:
  - Header action area stacks on small screens.
  - EmployeeProfileDetail is responsive internally.
*/
export default function EmployeeDetailPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { employeeId } = useParams();

  const { selectedEmployee, loading, error } = useSelector((state) => state.hr);

  /*
    Load selected employee detail when page opens.
  */
  useEffect(() => {
    if (employeeId) {
      dispatch(fetchEmployeeById(employeeId));
    }

    return () => {
      dispatch(clearSelectedEmployee());
      dispatch(clearHrError());
    };
  }, [dispatch, employeeId]);

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
            Employee Profile Detail
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
            View employee personal information, work authorization, and uploaded documents.
          </p>
        </div>

        <Button
          variant="outline-secondary"
          onClick={() => navigate("/hr/employee-profiles")}
          style={outlineSecondaryButtonStyle}
        >
          Back to Employee Profiles
        </Button>
      </div>

      {error && <Message variant="danger">{error}</Message>}

      {loading && !selectedEmployee ? (
        <Loading text="Loading employee profile..." />
      ) : (
        <EmployeeProfileDetail employee={selectedEmployee} />
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