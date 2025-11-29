import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import { uploadEmployeeAvatar } from "../api/images";
import { getInitials } from "../utils/avatar";

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
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!avatarPreview) {
      return undefined;
    }
    return () => URL.revokeObjectURL(avatarPreview);
  }, [avatarPreview]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
    event.target.value = "";
  };

  const handleAvatarClear = () => {
    setAvatarFile(null);
    setAvatarPreview("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const response = await axios.post("/emp/employees", formData);
      const employeeId = response?.data?.employee_id;

      if (avatarFile && employeeId) {
        try {
          await uploadEmployeeAvatar(employeeId, avatarFile);
        } catch (uploadError) {
          console.error(uploadError);
          window.alert(
            "Employee created but the avatar upload failed. Open the profile later to try again.",
          );
        }
      }
      navigate("/employees");
    } catch (err) {
      setError("We couldn't create the teammate. Please try again.");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const avatarInitials = getInitials(
    formData.first_name,
    formData.last_name,
    formData.email,
  );

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
        <div className="avatar-upload">
          <div className="avatar avatar-large">
            {avatarPreview ? (
              <img src={avatarPreview} alt="Selected avatar preview" />
            ) : (
              <span>{avatarInitials}</span>
            )}
          </div>
          <div className="avatar-upload-actions">
            <p className="subtle-text">
              Add a face to the name. Use a square PNG or JPG at least 320px.
            </p>
            <div className="avatar-upload-buttons">
              <label className="btn btn-ghost btn-small">
                Upload photo
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleAvatarChange}
                />
              </label>
              {avatarPreview && (
                <button
                  type="button"
                  className="btn btn-ghost btn-small"
                  onClick={handleAvatarClear}
                >
                  Remove
                </button>
              )}
            </div>
          </div>
        </div>
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
            <p className="subtle-text">We'll use this to schedule onboarding.</p>
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
