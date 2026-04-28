import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginSuccess } from "../features/auth/authSlice";
import { loginUser } from "../api/authApi";

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (event) => {
    event.preventDefault();
    setError("");

    try {
      const data = await loginUser({ username, password });

      dispatch(
        loginSuccess({
          user: {
            id: data.id,
            username: data.username,
            email: data.email,
            role: data.role,
            onboardingStatus: data.onboardingStatus || "never_submitted",
          },
          token: data.token,
        })
      );

      if (data.onboardingStatus === "approved") {
        navigate("/personal-info");
      } else {
        navigate("/onboarding");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h1>Login Page</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleLogin}>
        <div>
          <label>Username</label>
          <input
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />
        </div>

        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>

        <button type="submit">Login</button>
      </form>
    </div>
  );
}