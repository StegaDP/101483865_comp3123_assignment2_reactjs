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
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/emp/employees", formData);
      navigate("/employees");
    } catch (err) {
      setError("Failed to add employee");
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Add Employee</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="first_name"
          placeholder="First Name"
          onChange={handleChange}
          required
        />
        <input
          name="last_name"
          placeholder="Last Name"
          onChange={handleChange}
          required
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          onChange={handleChange}
          required
        />
        <input name="position" placeholder="Position" onChange={handleChange} />
        <input
          name="salary"
          type="number"
          placeholder="Salary"
          onChange={handleChange}
        />
        <input
          name="date_of_joining"
          type="date"
          placeholder="Date of Joining"
          onChange={handleChange}
        />
        <input
          name="department"
          placeholder="Department"
          onChange={handleChange}
        />
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit">Add Employee</button>
      </form>
    </div>
  );
};

export default AddEmployeePage;
