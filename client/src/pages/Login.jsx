import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("founder@startupgig.com");
  const [password, setPassword] = useState("Password123");
  const [error, setError] = useState("");

  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      const user = await login(email, password);
      navigate(user.role === "startup" ? "/dashboard/startup" : "/dashboard/freelancer");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <section className="auth-card">
      <h1>Login</h1>
      <form onSubmit={onSubmit} className="grid-form">
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        {error && <p className="error-text">{error}</p>}
        <button className="btn-primary">Login</button>
      </form>
    </section>
  );
};

export default Login;
