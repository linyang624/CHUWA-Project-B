import { Spinner } from "react-bootstrap";

/*
  Loading component

  Used when a page or component is waiting for backend data.

  HR examples:
  - loading employee profiles
  - loading visa status records
  - loading onboarding applications

  Employee examples:
  - loading personal information
  - loading onboarding form status
  - loading visa status
*/
export default function Loading({ text = "Loading..." }) {
  return (
    <div className="text-center py-4">
      <Spinner animation="border" role="status" />
      <div className="mt-2">{text}</div>
    </div>
  );
}