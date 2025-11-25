import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import EmployeeListPage from "./pages/EmployeeListPage";
import AddEmployeePage from "./pages/AddEmployeePage";
import EditEmployeePage from "./pages/EditEmployeePage";
import PrivateRoute from "./components/PrivateRoute";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/" element={<Navigate to="/employees" />} />
        <Route element={<PrivateRoute />}>
          <Route path="/employees" element={<EmployeeListPage />} />
          <Route path="/add-employee" element={<AddEmployeePage />} />
          <Route path="/edit-employee/:id" element={<EditEmployeePage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
