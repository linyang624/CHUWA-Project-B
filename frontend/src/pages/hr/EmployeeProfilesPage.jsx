import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Layout from "../../components/common/Layout";
import Loading from "../../components/common/Loading";
import Message from "../../components/common/Message";
import SearchBar from "../../components/common/SearchBar";
import EmployeeProfileTable from "../../components/hr/EmployeeProfileTable";

import {
  clearHrError,
  fetchEmployees,
} from "../../features/hr/hrSlice";

/*
  EmployeeProfilesPage

  HR can view all approved employees.

  Requirements:
  - show total number of employees
  - order alphabetically by last name
  - search by first name, last name, preferred name
  - click employee legal full name to view detail

  Responsive:
  - Search bar follows parent width.
  - EmployeeProfileTable uses responsive table.
*/
export default function EmployeeProfilesPage() {
  const dispatch = useDispatch();

  const [search, setSearch] = useState("");

  const { employees, loading, error } = useSelector((state) => state.hr);

  /*
    Load employees whenever search changes.

    If search is empty, backend returns all approved employees.
    If search has value, backend returns matched employees.
  */
  useEffect(() => {
    dispatch(fetchEmployees(search));

    return () => {
      dispatch(clearHrError());
    };
  }, [dispatch, search]);

  const getResultMessage = () => {
    if (loading) {
      return "";
    }

    if (!search.trim()) {
      return `Total Employees: ${employees.length}`;
    }

    if (employees.length === 0) {
      return "No records found.";
    }

    if (employees.length === 1) {
      return "1 record found.";
    }

    return `${employees.length} records found.`;
  };

  return (
    <Layout>
      <div className="mb-4">
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
          Employee Profiles
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
          Search and view approved employee profile records.
        </p>
      </div>

      {error && <Message variant="danger">{error}</Message>}

      <div
        className="mb-3"
        style={{
          background: "#ffffff",
          border: "1px solid #e5e7eb",
          borderRadius: "20px",
          padding: "18px",
          boxShadow: "0 10px 24px rgba(15, 23, 42, 0.05)",
          fontFamily:
            "Arial, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        }}
      >
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search by first name, last name, or preferred name..."
        />

        {getResultMessage() && (
          <div
            className="d-inline-flex align-items-center"
            style={{
              padding: "7px 12px",
              borderRadius: "999px",
              background: "#eef2ff",
              color: "#4f46e5",
              fontSize: "12px",
              fontWeight: "800",
            }}
          >
            {getResultMessage()}
          </div>
        )}
      </div>

      {loading ? (
        <Loading text="Loading employees..." />
      ) : (
        <EmployeeProfileTable employees={employees} />
      )}
    </Layout>
  );
}