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
import UnauthorizedPage from "./pages/unauthorized";
import AccountantDashboard from "./pages/AccountantDashboard";
import { HelmetProvider } from "react-helmet-async";

function App() {
  return (
    <HelmetProvider>
      <Router>
        <Navigation />
        <main className="container mx-auto py-4">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Login />} />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />

            {/* Protected Routes */}
            <Route element={<RequireAuth />}>
              {/* Admin Routes */}
              <Route path="/admin" element={<RequireRole roles={["admin"]} />}>
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="register" element={<Register />} />
                <Route path="projects/:id" element={<ProjectDetails />} />
                <Route path="dashboard/reports" element={<AdminReports />} />
              </Route>

              {/* Employee Routes */}
              <Route
                path="/employee"
                element={<RequireRole roles={["employee", "admin"]} />}
              >
                <Route path="dashboard" element={<EmployeeDashboard />} />
              </Route>

              {/* Accountant Routes */}
              <Route
                path="/accountant"
                element={<RequireRole roles={["accountant", "admin"]} />}
              >
                <Route path="dashboard" element={<AccountantDashboard />} />
              </Route>
            </Route>

            {/* 404 - Must be last */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
      </Router>
    </HelmetProvider>
  );
}

export default App;
