import { Table } from "react-bootstrap";

/*
  Reusable data table component.

  HR examples:
  - employee profile table
  - visa status table
  - registration token history table
  - onboarding application table

  Employee examples:
  - document list table
  - uploaded file summary table

  Responsive:
  - React Bootstrap Table responsive makes the table scroll horizontally
    on small screens instead of breaking the page layout.
*/
export default function DataTable({
  columns = [],
  data = [],
  renderRow,
  emptyMessage = "No records found.",
}) {
  return (
    <div
      style={{
        background: "#ffffff",
        border: "1px solid #e5e7eb",
        borderRadius: "18px",
        overflow: "hidden",
        boxShadow: "0 10px 24px rgba(15, 23, 42, 0.05)",
        fontFamily:
          "Arial, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >
      <Table responsive hover className="mb-0 align-middle">
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={column.key || column.label}
                style={{
                  background: "#f8fafc",
                  color: "#374151",
                  fontSize: "12px",
                  fontWeight: "800",
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                  borderBottom: "1px solid #e5e7eb",
                  padding: "14px 16px",
                  whiteSpace: "nowrap",
                }}
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="text-center"
                style={{
                  padding: "36px 16px",
                  color: "#6b7280",
                  fontSize: "14px",
                  fontWeight: "600",
                  borderBottom: "none",
                }}
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((item, index) => renderRow(item, index))
          )}
        </tbody>
      </Table>

      <style>
        {`
          table tbody td {
            padding: 14px 16px !important;
            color: #374151;
            font-size: 14px;
            border-bottom: 1px solid #eef2f7 !important;
          }

          table tbody tr:last-child td {
            border-bottom: none !important;
          }

          table tbody tr:hover td {
            background-color: #f8fafc !important;
          }
        `}
      </style>
    </div>
  );
}