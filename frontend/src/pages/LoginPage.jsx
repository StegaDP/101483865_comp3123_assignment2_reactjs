import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../api/axios";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/user/login", { email, password });
      localStorage.setItem("token", response.data.jwt_token);
      navigate("/employees");
    } catch (err) {
      setError("Invalid credentials");
      console.error(err);
    }
  };

  return (
    <div className="auth-page">
      <section className="auth-panel">
        <p className="eyebrow">Pulse HR OS</p>
        <h1>Command center for people-first teams</h1>
        <p>
          Launch a beautifully organized employee directory, automate
          onboarding, and keep payroll confidence high from one modern
          workspace.
        </p>
        <ul>
          <li>Live visibility into every department</li>
          <li>Smart alerts for expiring contracts and reviews</li>
          <li>Secure SSO-ready authentication flows</li>
        </ul>
      </section>

      <div className="auth-card">
        <div className="page-hero">
          <p className="eyebrow">Welcome back</p>
          <h2>Sign in to Pulse</h2>
          <p>Enter your work credentials to unlock the operations hub.</p>
        </div>
        <form className="form-stack" onSubmit={handleLogin}>
          <div className="input-field">
            <label className="input-label" htmlFor="login-email">
              Work email
            </label>
            <input
              id="login-email"
              className="input-control"
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-field">
            <label className="input-label" htmlFor="login-password">
              Password
            </label>
            <input
              id="login-password"
              className="input-control"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="form-error">{error}</p>}
          <button type="submit" className="btn btn-primary">
            Enter workspace
          </button>
        </form>
        <p className="auth-footer">
          New to Pulse?{" "}
          <Link className="link-inline" to="/signup">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
