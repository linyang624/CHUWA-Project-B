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
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-2 mb-4">
        <h1 className="mb-0">Employee Profile Detail</h1>

        <Button
          variant="outline-secondary"
          onClick={() => navigate("/hr/employee-profiles")}
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