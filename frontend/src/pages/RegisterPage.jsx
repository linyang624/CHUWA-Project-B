import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function RegisterPage() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("new.employee@example.com");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const isValidToken = token === "test-token";

  const handleRegister = (event) => {
    event.preventDefault();

    if (!isValidToken) {
      setError("Invalid or expired registration token.");
      return;
    }

    if (!username || !email || !password) {
      setError("Please fill in all required fields.");
      return;
    }

    // TODO: Replace this fake registration logic with backend API call.
    console.log("Registered user:", {
      username,
      email,
      password,
      token,
    });

    navigate("/login");
  };

  if (!isValidToken) {
    return (
      <div>
        <h1>Registration Page</h1>
        <p style={{ color: "red" }}>Invalid or expired registration token.</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Registration Page</h1>
      <p>Registration Token: {token}</p>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleRegister}>
        <div>
          <label>Username</label>
          <input
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />
        </div>

        <div>
          <label>Email</label>
          <input value={email} disabled />
        </div>

        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>

        <button type="submit">Register</button>
      </form>
    </div>
  );
}