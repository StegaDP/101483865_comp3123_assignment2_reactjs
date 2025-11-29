import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../api/axios";
import { uploadEmployeeAvatar } from "../api/images";
import { buildAvatarUrl, getInitials } from "../utils/avatar";

const EditEmployeePage = () => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    position: "",
    salary: "",
    date_of_joining: "",
    department: "",
  });
  const [currentImageId, setCurrentImageId] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await axios.get(`/emp/employees/${id}`);
        const employee = response.data || {};
        if (employee.date_of_joining) {
          employee.date_of_joining = new Date(employee.date_of_joining)
            .toISOString()
            .split("T")[0];
        }
        const sanitized = {
          first_name: employee.first_name || "",
          last_name: employee.last_name || "",
          email: employee.email || "",
          position: employee.position || "",
          salary: employee.salary ? String(employee.salary) : "",
          date_of_joining: employee.date_of_joining || "",
          department: employee.department || "",
        };
        setFormData(sanitized);
        setCurrentImageId(employee.imageId || "");
        setAvatarFile(null);
        setAvatarPreview("");
      } catch (err) {
        setError("We couldn't load the teammate profile.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [id]);

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
      await axios.put(`/emp/employees/${id}`, formData);
    } catch (err) {
      setError("Update failed. Please try again.");
      console.error(err);
      setSaving(false);
      return;
    }

    if (avatarFile) {
      try {
        await uploadEmployeeAvatar(id, avatarFile);
      } catch (uploadError) {
        setError("Photo upload failed. Please try again.");
        console.error(uploadError);
        setSaving(false);
        return;
      }
    }

    navigate("/employees");
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="form-page">
        <div className="page-hero">
          <p className="eyebrow">People operations</p>
          <h1>Loading teammate profile</h1>
          <p>Hang tight while we sync the latest record.</p>
        </div>
        <div className="glass-card">
          <p className="subtle-text">Fetching profile...</p>
        </div>
      </div>
    );
  }

  const avatarInitials = getInitials(
    formData.first_name,
    formData.last_name,
    formData.email,
  );
  const avatarSource = avatarPreview || buildAvatarUrl(currentImageId);

  return (
    <div className="form-page">
      <div className="page-hero">
        <p className="eyebrow">People operations</p>
        <h1>Update teammate record</h1>
        <p>Edit naming, department, or compensation details in seconds.</p>
      </div>
      <form className="form-card form-stack" onSubmit={handleSubmit}>
        <div className="avatar-upload">
          <div className="avatar avatar-large">
            {avatarSource ? (
              <img src={avatarSource} alt="Current avatar" />
            ) : (
              <span>{avatarInitials}</span>
            )}
          </div>
          <div className="avatar-upload-actions">
            <p className="subtle-text">
              Drop in a new image to refresh their avatar. Square PNG or JPG
              works best.
            </p>
            <div className="avatar-upload-buttons">
              <label className="btn btn-ghost btn-small">
                {avatarFile ? "Change selection" : "Upload new photo"}
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleAvatarChange}
                />
              </label>
              {avatarFile && (
                <button
                  type="button"
                  className="btn btn-ghost btn-small"
                  onClick={handleAvatarClear}
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>
        <div className="form-grid">
          <div className="input-field">
            <label className="input-label" htmlFor="edit-first-name">
              First name
            </label>
            <input
              id="edit-first-name"
              className="input-control"
              name="first_name"
              placeholder="First name"
              value={formData.first_name || ""}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-field">
            <label className="input-label" htmlFor="edit-last-name">
              Last name
            </label>
            <input
              id="edit-last-name"
              className="input-control"
              name="last_name"
              placeholder="Last name"
              value={formData.last_name || ""}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-field">
            <label className="input-label" htmlFor="edit-email">
              Work email
            </label>
            <input
              id="edit-email"
              className="input-control"
              name="email"
              type="email"
              placeholder="email@company.com"
              value={formData.email || ""}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-field">
            <label className="input-label" htmlFor="edit-position">
              Role or title
            </label>
            <input
              id="edit-position"
              className="input-control"
              name="position"
              placeholder="Role"
              value={formData.position || ""}
              onChange={handleChange}
            />
          </div>
          <div className="input-field">
            <label className="input-label" htmlFor="edit-department">
              Department
            </label>
            <input
              id="edit-department"
              className="input-control"
              name="department"
              placeholder="Department"
              value={formData.department || ""}
              onChange={handleChange}
            />
          </div>
          <div className="input-field">
            <label className="input-label" htmlFor="edit-salary">
              Salary (annual)
            </label>
            <input
              id="edit-salary"
              className="input-control"
              name="salary"
              type="number"
              min="0"
              placeholder="90000"
              value={formData.salary || ""}
              onChange={handleChange}
            />
          </div>
          <div className="input-field">
            <label className="input-label" htmlFor="edit-doj">
              Start date
            </label>
            <input
              id="edit-doj"
              className="input-control"
              name="date_of_joining"
              type="date"
              value={formData.date_of_joining || ""}
              onChange={handleChange}
            />
            <p className="subtle-text">
              Used to track anniversaries and tenure.
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
            {saving ? "Updating..." : "Save changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditEmployeePage;
