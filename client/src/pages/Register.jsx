import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "freelancer"
  });
  const [error, setError] = useState("");

  const onChange = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      const user = await register(form);
      navigate(user.role === "startup" ? "/dashboard/startup" : "/dashboard/freelancer");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <section className="auth-card">
      <h1>Create Account</h1>
      <form onSubmit={onSubmit} className="grid-form">
        <input placeholder="Name" value={form.name} onChange={(e) => onChange("name", e.target.value)} />
        <input placeholder="Email" value={form.email} onChange={(e) => onChange("email", e.target.value)} />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => onChange("password", e.target.value)}
        />
        <select value={form.role} onChange={(e) => onChange("role", e.target.value)}>
          <option value="freelancer">Freelancer</option>
          <option value="startup">Startup</option>
          <option value="admin">Admin</option>
        </select>
        {error && <p className="error-text">{error}</p>}
        <button className="btn-primary">Register</button>
      </form>
    </section>
  );
};

export default Register;
