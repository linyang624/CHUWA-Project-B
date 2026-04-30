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
    <div
      className="d-flex flex-column align-items-center justify-content-center text-center py-5"
      style={{
        fontFamily:
          "Arial, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        color: "#4b5563",
      }}
    >
      <div
        className="d-flex align-items-center justify-content-center mb-3"
        style={{
          width: "58px",
          height: "58px",
          borderRadius: "18px",
          background: "#eef2ff",
        }}
      >
        <Spinner
          animation="border"
          role="status"
          style={{
            width: "26px",
            height: "26px",
            color: "#4f46e5",
          }}
        />
      </div>

      <div
        style={{
          fontSize: "15px",
          fontWeight: "700",
          color: "#374151",
        }}
      >
        {text}
      </div>
    </div>
  );
}