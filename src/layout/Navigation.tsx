import { Link } from "react-router-dom";
import { useAuth } from "../features/auth/useAuth";

function Navigation() {
  const { logout, user, bootstrapped } = useAuth();

  // Show nothing or loading state while auth is initializing
  if (!bootstrapped) {
    return (
      <nav className="p-4 bg-blue-100">
        <div className="flex max-w-2xl mx-auto justify-between">
          <div className="flex">
            <h1 className="text-2xl md:text-3xl font-bold">
              TOTALENTREPRENØR AS -{" "}
            </h1>
            <h2 className="text-2xl md:text-3xl font-bold">TIME TRACKER</h2>
          </div>
          <div>Loading...</div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="p-4 bg-blue-100">
      <div className="flex mx-auto justify-between">
        <div className="flex">
          <h1 className="text-2xl md:text-3xl font-bold"></h1>
        </div>
        <div>
          <ul className="flex space-x-4 items-center">
            {/* Show dashboard links only if user is authenticated */}
            {user && (
              <>
                {user.role === "employee" && (
                  <Link
                    to="/employee/dashboard"
                    className="text-sm text-yellow-900 hover:underline cursor-pointer"
                  >
                    Dashboard
                  </Link>
                )}
                {user.role === "admin" && (
                  <Link
                    to="/admin/dashboard"
                    className="text-sm text-yellow-900 hover:underline cursor-pointer"
                  >
                    Admin dashboard
                  </Link>
                )}
                {/* Optional: Show both links for admin to switch between dashboards */}
                {user.role === "admin" && (
                  <Link
                    to="/employee/dashboard"
                    className="text-sm text-blue-400 hover:underline cursor-pointer"
                  >
                    View Employee
                  </Link>
                )}
              </>
            )}

            {/* Show logout if authenticated, login if not */}
            {user ? (
              <button
                className="text-white font-semi-bold bg-gray-700 hover:bg-gray-800 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-gray-600 dark:hover:bg-gray-700 pointer"
                onClick={logout}
              >
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                className="text-white font-semi-bold bg-green-700 hover:bg-green-800 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-green-600 dark:hover:bg-green-700"
              >
                Login
              </Link>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;
