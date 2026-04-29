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
      <Form.Control
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
      />
    </Form.Group>
  );
}