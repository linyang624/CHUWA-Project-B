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
    <Table responsive bordered hover>
      <thead>
        <tr>
          {columns.map((column) => (
            <th key={column.key || column.label}>{column.label}</th>
          ))}
        </tr>
      </thead>

      <tbody>
        {data.length === 0 ? (
          <tr>
            <td colSpan={columns.length} className="text-center">
              {emptyMessage}
            </td>
          </tr>
        ) : (
          data.map((item, index) => renderRow(item, index))
        )}
      </tbody>
    </Table>
  );
}