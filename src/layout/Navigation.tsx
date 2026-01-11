import { Link } from "react-router-dom";
import { useAuth } from "../features/auth/useAuth";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

function Navigation() {
  const { logout, user, bootstrapped } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/"); // Navigate to homepage first
    logout(); // Then logout
  };

  if (!bootstrapped) {
    return (
      <nav className="p-4 bg-blue-100">
        <div className="flex max-w-2xl mx-auto justify-between">
          <div className="flex">
            <h1 className="text-2xl md:text-3xl font-bold">TOTAL TIMING</h1>
            <h2 className="text-2xl md:text-3xl font-bold">TIME TRACKER</h2>
          </div>
          <div>Loading...</div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="p-4 bg-white border-b border-gray-300 shadow-sm">
      <div className="flex mx-auto justify-between items-center max-w-5xl">
        {/* Logo */}
        <div className="flex items-center">
          <img src="/totaltiminglogo.svg" className="h-25 mr-3" alt="Logo" />
        </div>

        {/* Hamburger button (mobile only) */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-gray-700 hover:text-black focus:outline-none cursor-pointer"
        >
          {menuOpen ? <X size={30} /> : <Menu size={30} />}
        </button>

        {/* Desktop menu */}
        <ul className="hidden md:flex space-x-4 items-center">
          {user && (
            <>
              {user.role === "employee" && (
                <Link
                  to="/employee/dashboard"
                  className="text-sm text-green-600 border p-3 hover:bg-gray-900"
                >
                  Employee Dashboard
                </Link>
              )}
              {user.role === "accountant" && (
                <Link
                  to="/accountant/dashboard"
                  className="text-sm text-green-600 border p-3 hover:bg-gray-900"
                >
                  Regnskap
                </Link>
              )}
              {user.role === "admin" && (
                <>
                  <Link
                    to="/admin/dashboard"
                    className="text-sm text-blue-600 border p-3 hover:bg-gray-800"
                  >
                    Admin
                  </Link>
                  <Link
                    to="/employee/dashboard"
                    className="text-sm text-green-600 border p-3 hover:bg-gray-800"
                  >
                    Ansatte
                  </Link>
                  <Link
                    to="/accountant/dashboard"
                    className="text-sm text-black border p-3 hover:bg-gray-800"
                  >
                    Regnskap
                  </Link>
                </>
              )}
            </>
          )}

          {user ? (
            <div className="relative">
              <div
                className="text-sm text-green-600 border p-3 hover:bg-gray-800 cursor-pointer"
                onClick={() => setIsOpen((prev) => !prev)}
              >
                Profile
              </div>

              {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg p-4 z-50">
                  <p className="text-sm text-gray-700 mb-1">Logged in as</p>
                  <p className="font-medium text-gray-900 mb-3">{user.name}</p>
                  <button
                    onClick={handleLogout}
                    className="w-full text-white bg-gray-700 hover:bg-gray-800 font-medium rounded-lg text-sm px-5 py-2.5"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/"
              className="bg-black text-white font-semibold py-3 px-6 self-center hover:bg-[#e85f00] transition cursor-pointer"
            >
              Login
            </Link>
          )}
        </ul>
      </div>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div className="md:hidden mt-4 border-t pt-4 pb-4 border-b absolute w-full bg-white left-0 px-4 h-[100vh] flex justify-center items-center z-40 ">
          <ul className="space-y-3 flex gap-3 flex-col">
            {user && (
              <>
                {user.role === "employee" && (
                  <Link
                    to="/employee/dashboard"
                    className="block bg-black text-white font-semibold py-3 px-6 self-center transition cursor-pointer"
                    onClick={() => setMenuOpen(false)}
                  >
                    Employee Dashboard
                  </Link>
                )}
                {user.role === "admin" && (
                  <>
                    <Link
                      to="/admin/dashboard"
                      className="block bg-gray-900 text-white font-semibold py-3 px-6 self-center hover:bg-gray-600 transition cursor-pointer"
                      onClick={() => setMenuOpen(false)}
                    >
                      Admin Dashboard
                    </Link>
                    <Link
                      to="/employee/dashboard"
                      className="block bg-gray-900 text-white font-semibold py-3 px-6 self-center hover:bg-gray-600 transition cursor-pointer"
                      onClick={() => setMenuOpen(false)}
                    >
                      Employee Dashboard
                    </Link>
                    <Link
                      to="/accountant/dashboard"
                      className="text-sm text-black border p-3 hover:bg-gray-800"
                    >
                      Regnskap
                    </Link>
                  </>
                )}
              </>
            )}

            {user ? (
              <div className="mt-3 border-t pt-3 flex justify-center flex-col items-center">
                <p className="text-sm text-gray-700 mb-1">Logged in as</p>
                <p className="font-medium text-gray-900 mb-3">{user.name}</p>
                <button
                  onClick={() => {
                    handleLogout();
                    setMenuOpen(false);
                  }}
                  className="block bg-black text-white font-semibold py-3 px-6 self-center hover:bg-[#e85f00] transition cursor-pointer"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="block bg-black text-white font-semibold py-3 px-6 self-center hover:bg-[#e85f00] transition cursor-pointer"
              >
                Login
              </Link>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
}

export default Navigation;
