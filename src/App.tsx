// App.tsx or App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navigation from "./layout/Navigation";
import Login from "./pages/Login";
import ProjectDetails from "./components/projects/ProjectDetails";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Register from "./pages/RegisterPage";
import AdminReports from "./pages/AdminReports";

function App() {
  return (
    <Router>
      <div className="">
        <Navigation />
        <main className="container mx-auto py-4">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/admin/register" element={<Register />} />
            {/* Example: Protected route with a form */}
            <Route path="admin/projects/:id" element={<ProjectDetails />} />
            <Route path="/employee-dashboard" element={<EmployeeDashboard />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/admin-dashboard/reports" element={<AdminReports />} />
            <Route
              path="admin-dashboard/reports/projects/:projectId"
              element={<AdminReports />}
            />
            {/* Default route */}
            <Route path="/" element={<AdminDashboard />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
