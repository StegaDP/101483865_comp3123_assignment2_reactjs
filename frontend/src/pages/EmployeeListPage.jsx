import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../api/axios";
import { buildAvatarUrl, getInitials } from "../utils/avatar";

const EmployeeListPage = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get("/emp/employees");
        setEmployees(response.data || []);
      } catch (err) {
        setError("We couldn't load your directory.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchEmployees();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Remove this teammate from the directory?")) {
      try {
        await axios.delete(`/emp/employees?eid=${id}`);
        setEmployees((prev) => prev.filter((emp) => emp.employee_id !== id));
      } catch (err) {
        setError("Delete failed. Please try again.");
        console.error(err);
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleResetFilters = () => setSearchTerm("");

  const departmentCounts = useMemo(() => {
    return employees.reduce((acc, employee) => {
      const key = employee.department || "Unassigned";
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});
  }, [employees]);

  const sortedEmployees = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    const filtered = query
      ? employees.filter((employee) => {
          const name =
            `${employee.first_name || ""} ${employee.last_name || ""}`.toLowerCase();
          return (
            name.includes(query) ||
            (employee.email || "").toLowerCase().includes(query) ||
            (employee.department || "").toLowerCase().includes(query) ||
            (employee.position || "").toLowerCase().includes(query)
          );
        })
      : employees;
    return [...filtered].sort((a, b) => {
      const nameA = `${a.first_name || ""} ${a.last_name || ""}`
        .trim()
        .toLowerCase();
      const nameB = `${b.first_name || ""} ${b.last_name || ""}`
        .trim()
        .toLowerCase();
      return nameA.localeCompare(nameB);
    });
  }, [employees, searchTerm]);

  const totalPayroll = useMemo(() => {
    return employees.reduce(
      (sum, employee) => sum + Number(employee.salary || 0),
      0,
    );
  }, [employees]);

  const avgPayroll = employees.length ? totalPayroll / employees.length : 0;

  const topDepartmentEntry = useMemo(() => {
    return Object.entries(departmentCounts)
      .sort((a, b) => b[1] - a[1])
      .shift();
  }, [departmentCounts]);

  const currencyFormatter = useMemo(
    () =>
      new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      }),
    [],
  );

  const formatCurrency = (value) =>
    currencyFormatter.format(Number(value || 0));

  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="page-hero">
          <p className="eyebrow">People directory</p>
          <h1>Syncing your workspace</h1>
          <p>We are fetching the latest employee roster.</p>
        </div>
        <div className="glass-card">
          <p className="subtle-text">Loading employees...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-card">
        <p className="form-error">{error}</p>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <div className="page-hero">
          <p className="eyebrow">People directory</p>
          <h1>Make every teammate visible</h1>
          <p>
            Search, edit, and organize employees from one beautifully modern
            command center.
          </p>
        </div>
        <div className="dashboard-actions">
          <button className="btn btn-ghost" onClick={handleLogout}>
            Logout
          </button>
          <Link className="btn btn-primary" to="/add-employee">
            Add teammate
          </Link>
        </div>
      </header>

      <section className="insight-grid">
        <div className="insight-card">
          <p className="subtle-text">Active teammates</p>
          <h3>{employees.length}</h3>
          <p>{Object.keys(departmentCounts).length} total departments</p>
        </div>
        <div className="insight-card">
          <p className="subtle-text">Top department</p>
          <h3>{topDepartmentEntry ? topDepartmentEntry[0] : "Unassigned"}</h3>
          <p>{topDepartmentEntry ? topDepartmentEntry[1] : 0} members</p>
        </div>
        <div className="insight-card">
          <p className="subtle-text">Average salary</p>
          <h3>{formatCurrency(avgPayroll)}</h3>
          <p>Total payroll {formatCurrency(totalPayroll)}</p>
        </div>
      </section>

      <section className="table-card">
        <div className="table-toolbar">
          <div className="search-field">
            <label className="input-label" htmlFor="employee-search">
              Search directory
            </label>
            <input
              id="employee-search"
              className="input-control"
              type="search"
              placeholder="Search by name, email, or department"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="list-meta">
            <span className="badge">
              Showing {sortedEmployees.length} people
            </span>
            <span className="badge">
              {Object.keys(departmentCounts).length} depts
            </span>
            {searchTerm && (
              <button
                type="button"
                className="btn btn-ghost btn-small"
                onClick={handleResetFilters}
              >
                Reset filter
              </button>
            )}
          </div>
        </div>
        {sortedEmployees.length === 0 ? (
          <div className="empty-state">
            <h3>No teammates found</h3>
            <p>
              Adjust your search or add the first teammate to your workspace.
            </p>
            <div className="form-actions" style={{ justifyContent: "center" }}>
              <button
                type="button"
                className="btn btn-ghost btn-small"
                onClick={handleResetFilters}
              >
                Clear search
              </button>
              <Link className="btn btn-primary btn-small" to="/add-employee">
                Add teammate
              </Link>
            </div>
          </div>
        ) : (
          <div className="table-scroll">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Department</th>
                  <th>Role</th>
                  <th>Salary</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedEmployees.map((employee) => {
                  const fullName =
                    `${(employee.first_name || "").trim()} ${(employee.last_name || "").trim()}`.trim();
                  const avatarUrl = buildAvatarUrl(employee.imageId);
                  const avatarInitials = getInitials(
                    employee.first_name,
                    employee.last_name,
                    employee.email,
                  );
                  const avatarAlt =
                    fullName || employee.email || "Employee avatar";

                  return (
                    <tr key={employee.employee_id}>
                      <td>
                        <div className="person-cell">
                          <div className="avatar avatar-small">
                            {avatarUrl ? (
                              <img src={avatarUrl} alt={avatarAlt} />
                            ) : (
                              <span>{avatarInitials}</span>
                            )}
                          </div>
                          <div className="person-meta">
                            <strong>{fullName || employee.email}</strong>
                            <p className="subtle-text">{employee.email}</p>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="chip accent">
                          {employee.department || "Unassigned"}
                        </span>
                      </td>
                      <td>{employee.position || "-"}</td>
                      <td>
                        {employee.salary
                          ? formatCurrency(employee.salary)
                          : "-"}
                      </td>
                      <td>
                        <div className="table-actions">
                          <Link
                            className="btn btn-ghost btn-small"
                            to={`/edit-employee/${employee.employee_id}`}
                          >
                            Edit
                          </Link>
                          <button
                            type="button"
                            className="btn btn-danger btn-small"
                            onClick={() => handleDelete(employee.employee_id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};

export default EmployeeListPage;
