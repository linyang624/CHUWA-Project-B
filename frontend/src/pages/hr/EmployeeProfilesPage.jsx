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
      <h1 className="mb-4">Employee Profiles</h1>

      {error && <Message variant="danger">{error}</Message>}

      <SearchBar
        value={search}
        onChange={setSearch}
        placeholder="Search by first name, last name, or preferred name..."
      />

      {getResultMessage() && (
        <p className="mb-3">{getResultMessage()}</p>
      )}

      {loading ? (
        <Loading text="Loading employees..." />
      ) : (
        <EmployeeProfileTable employees={employees} />
      )}
    </Layout>
  );
}