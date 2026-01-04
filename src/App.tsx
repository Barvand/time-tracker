// App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navigation from "./layout/Navigation";
import Login from "./pages/Login";
import ProjectDetails from "./components/projects/ProjectDetails";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Register from "./pages/RegisterPage";
import AdminReports from "./pages/AdminReports";
import RequireRole from "./app/RequireRoleRoute";
import RequireAuth from "./app/RequireAuth";
import NotFoundPage from "./pages/404";
import UnAuthorizedPage from "./pages/unauthorized";
import AccountantDashboard from "./pages/AccountantDashboard";

function App() {
  return (
    <Router>
      <Navigation />
      <main className="container mx-auto py-4">
        <Routes>
          {/* Public */}
          <Route path="/" element={<Login />} />

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
            <Route element={<RequireRole roles={["accountant", "admin"]} />}>
              <Route
                path="/accountant/dashboard"
                element={<AccountantDashboard />}
              />
            </Route>
          </Route>
          <Route path="/unauthorized" element={<UnAuthorizedPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
