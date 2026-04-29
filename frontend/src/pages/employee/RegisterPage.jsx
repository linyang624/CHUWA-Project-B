import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { verifyRegistrationToken, registerWithToken } from "../../api/registrationApi";

export default function RegisterPage() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const checkToken = async () => {
      try {
        const data = await verifyRegistrationToken(token);
        setEmail(data.email);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    checkToken();
  }, [token]);

  const handleRegister = async (event) => {
    event.preventDefault();
    setError("");

    if (!username || !password) {
      setError("Please fill in all required fields.");
      return;
    }

    try {
      await registerWithToken(token, {
        username,
        password,
      });

      navigate("/login");
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return <p>Checking registration token...</p>;
  }

  if (error && !email) {
    return (
      <div>
        <h1>Registration Page</h1>
        <p style={{ color: "red" }}>{error}</p>
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