import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginSuccess } from "../features/auth/authSlice";

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (event) => {
    event.preventDefault(); // prevent the browser refresh automatically
    
    // mock
    const fakeUser = {
      id: "employee-1",
      username,
      role: "employee",
      onboardingStatus: "never_submitted",
      // "pending",
      // "rejected"
      // "approved",
    };

    dispatch(
      loginSuccess({
        user: fakeUser,
        token: "fake-employee-token",
      })
    );

    navigate("/onboarding");
  };

  return (
    <div>
      <h1>Login Page</h1>

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