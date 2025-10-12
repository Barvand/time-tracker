// App.tsx
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Navigation from "./layout/Navigation";
import Login from "./pages/Login";
import ProjectDetails from "./components/projects/ProjectDetails";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Register from "./pages/RegisterPage";
import AdminReports from "./pages/AdminReports";
import RequireRole from "./app/RequireRoleRoute";
import RequireAuth from "./app/RequireAuth";
import HomePage from "./pages/HomePage";

function App() {
  return (
    <Router>
      <Navigation />
      <main className="container mx-auto py-4">
        <Routes>
          {/* Public */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />

          {/* Everything below here requires auth */}
          <Route element={<RequireAuth />}>
            {/* Admin-only */}
            <Route element={<RequireRole roles={["admin"]} />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/register" element={<Register />} />
              <Route path="/admin/projects/:id" element={<ProjectDetails />} />
              <Route
                path="/admin/dashboard/reports"
                element={<AdminReports />}
              />
            </Route>

            {/* Employee-only */}
            <Route element={<RequireRole roles={["employee", "admin"]} />}>
              <Route
                path="/employee/dashboard"
                element={<EmployeeDashboard />}
              />
            </Route>
          </Route>

          {/* Default + catch-all */}
          <Route path="/" element={<Navigate to="/" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
