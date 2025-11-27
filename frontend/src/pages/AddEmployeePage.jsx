import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";

const AddEmployeePage = () => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    position: "",
    salary: "",
    date_of_joining: "",
    department: "",
  });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      await axios.post("/emp/employees", formData);
      navigate("/employees");
    } catch (err) {
      setError("We couldn’t create the teammate. Please try again.");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="form-page">
      <div className="page-hero">
        <p className="eyebrow">People operations</p>
        <h1>Invite a new teammate</h1>
        <p>
          Capture the essentials up front so HR, payroll, and IT can be ready on
          day one.
        </p>
      </div>
      <form className="form-card form-stack" onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="input-field">
            <label className="input-label" htmlFor="add-first-name">
              First name
            </label>
            <input
              id="add-first-name"
              className="input-control"
              name="first_name"
              placeholder="Jamie"
              value={formData.first_name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-field">
            <label className="input-label" htmlFor="add-last-name">
              Last name
            </label>
            <input
              id="add-last-name"
              className="input-control"
              name="last_name"
              placeholder="Lee"
              value={formData.last_name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-field">
            <label className="input-label" htmlFor="add-email">
              Work email
            </label>
            <input
              id="add-email"
              className="input-control"
              name="email"
              type="email"
              placeholder="jamie@company.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-field">
            <label className="input-label" htmlFor="add-position">
              Role or title
            </label>
            <input
              id="add-position"
              className="input-control"
              name="position"
              placeholder="Product Manager"
              value={formData.position}
              onChange={handleChange}
            />
          </div>
          <div className="input-field">
            <label className="input-label" htmlFor="add-department">
              Department
            </label>
            <input
              id="add-department"
              className="input-control"
              name="department"
              placeholder="Product"
              value={formData.department}
              onChange={handleChange}
            />
          </div>
          <div className="input-field">
            <label className="input-label" htmlFor="add-salary">
              Salary (annual)
            </label>
            <input
              id="add-salary"
              className="input-control"
              name="salary"
              type="number"
              min="0"
              placeholder="90000"
              value={formData.salary}
              onChange={handleChange}
            />
          </div>
          <div className="input-field">
            <label className="input-label" htmlFor="add-doj">
              Start date
            </label>
            <input
              id="add-doj"
              className="input-control"
              name="date_of_joining"
              type="date"
              value={formData.date_of_joining}
              onChange={handleChange}
            />
            <p className="subtle-text">
              We’ll use this to schedule onboarding.
            </p>
          </div>
        </div>
        {error && <p className="form-error">{error}</p>}
        <div className="form-actions">
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => navigate(-1)}
          >
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? "Saving..." : "Create teammate"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddEmployeePage;
