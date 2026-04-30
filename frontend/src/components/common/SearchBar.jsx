import { Form } from "react-bootstrap";

/*
  Reusable search bar.

  HR examples:
  - search employees by first name, last name, preferred name
  - search visa records

  Employee examples:
  - can be reused if employee side needs search later

  Responsive:
  - width follows the parent container
  - on small screens, it takes full available width
*/
export default function SearchBar({
  value,
  onChange,
  placeholder = "Search...",
}) {
  return (
    <Form.Group className="mb-3">
      <div
        className="position-relative"
        style={{
          fontFamily:
            "Arial, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        }}
      >
        <Form.Control
          type="text"
          value={value}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
          style={{
            height: "46px",
            borderRadius: "14px",
            border: "1px solid #d8dee8",
            backgroundColor: "#ffffff",
            color: "#1f2937",
            fontSize: "14px",
            fontWeight: "500",
            paddingLeft: "42px",
            paddingRight: "14px",
            boxShadow: "0 6px 16px rgba(15, 23, 42, 0.04)",
          }}
        />

        <span
          className="position-absolute top-50 translate-middle-y"
          style={{
            left: "15px",
            color: "#9ca3af",
            fontSize: "15px",
            pointerEvents: "none",
          }}
        >
          🔍
        </span>
      </div>
    </Form.Group>
  );
}