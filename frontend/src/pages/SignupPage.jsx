import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../api/axios";

const SignupPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/user/signup", { username, email, password });
      navigate("/login");
    } catch (err) {
      setError("Failed to create account");
      console.error(err);
    }
  };

  return (
    <div className="auth-page">
      <section className="auth-panel">
        <p className="eyebrow">Scale every workflow</p>
        <h1>Spin up a premium HR cockpit in minutes</h1>
        <p>
          Bring applicant tracking, onboarding, and payroll together without a
          single spreadsheet. Pulse keeps your team in sync across every stage
          of the employee journey.
        </p>
        <ul>
          <li>Granular role-based permissions built-in</li>
          <li>Guided onboarding checklists and reminders</li>
          <li>Beautiful insights for executives & founders</li>
        </ul>
      </section>
      <div className="auth-card">
        <div className="page-hero">
          <p className="eyebrow">Get started</p>
          <h2>Create your workspace</h2>
          <p>Set up the first administrator account for your company.</p>
        </div>
        <form className="form-stack" onSubmit={handleSignup}>
          <div className="input-field">
            <label className="input-label" htmlFor="signup-username">
              Full name
            </label>
            <input
              id="signup-username"
              className="input-control"
              type="text"
              placeholder="Jamie Lee"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="input-field">
            <label className="input-label" htmlFor="signup-email">
              Work email
            </label>
            <input
              id="signup-email"
              className="input-control"
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-field">
            <label className="input-label" htmlFor="signup-password">
              Password
            </label>
            <input
              id="signup-password"
              className="input-control"
              type="password"
              placeholder="Minimum 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="form-error">{error}</p>}
          <button type="submit" className="btn btn-primary">
            Launch workspace
          </button>
        </form>
        <p className="auth-footer">
          Already inside Pulse?{" "}
          <Link className="link-inline" to="/login">
            Sign in instead
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
