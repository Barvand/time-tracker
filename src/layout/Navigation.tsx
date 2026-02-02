import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../features/auth/useAuth";
import { useState, useRef, useEffect } from "react";
import { Menu, X, ChevronDown } from "lucide-react";

type UserRole = "employee" | "admin" | "accountant";

interface User {
  name: string;
  role: UserRole;
}

interface NavLinkProps {
  to: string;
  children: React.ReactNode;
}

interface MobileLinkProps extends NavLinkProps {
  close: (open: boolean) => void;
}

function Navigation() {
  const { logout, user, bootstrapped } = useAuth() as {
    user: User | null;
    logout: () => void;
    bootstrapped: boolean;
  };

  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [profileOpen, setProfileOpen] = useState<boolean>(false);

  const profileRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  const handleLogout = (): void => {
    navigate("/");
    logout();
  };

  /* Close profile dropdown on outside click */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!bootstrapped) {
    return (
      <nav className="border-b">
        <div className="max-w-5xl mx-auto px-4 py-4 flex justify-between">
          <span className="font-semibold">Total Timing</span>
          <span className="text-sm text-gray-400">Loading…</span>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-white shadow-xs sticky top-0 z-50">
      <div className="mx-auto px-4 py-4 flex items-center justify-evenly">
        <Link to="/" className="text-lg font-semibold tracking-tight">
          <img
            src="/totaltiminglogo.svg"
            alt="Total Timing Logo"
            className="w-100"
          />
        </Link>

        {/* Mobile toggle */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-gray-700 cursor-pointer"
        >
          {menuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>

        {/* Desktop navigation */}
        <div className="hidden md:flex items-center gap-8">
          {user?.role === "employee" && (
            <NavLink to="/employee/dashboard">Dashboard</NavLink>
          )}

          {user?.role === "accountant" && (
            <NavLink to="/accountant/dashboard">Regnskap</NavLink>
          )}

          {user?.role === "admin" && (
            <>
              <NavLink to="/admin/dashboard">Admin</NavLink>
              <NavLink to="/employee/dashboard">Ansatte</NavLink>
              <NavLink to="/accountant/dashboard">Regnskap</NavLink>
            </>
          )}

          {/* Profile dropdown */}
          {user && (
            <div ref={profileRef} className="relative">
              <button
                onClick={() => setProfileOpen((prev) => !prev)}
                className="cursor-pointer flex items-center gap-2 text-md font-semibold text-gray-700 hover:text-black transition"
              >
                {user.name}
                <ChevronDown size={14} />
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-3 w-44 shadow-md bg-gray-50 p-4">
                  <p className="text-xs text-gray-400 mb-1">Signed in as</p>
                  <p className="text-sm font-medium mb-4 ">{user.name}</p>

                  <button
                    onClick={handleLogout}
                    className="w-full text-left text-sm text-red-600 hover:text-red-700 transition cursor-pointer"
                  >
                    Log out
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Mobile side drawer */}
      <div
        className={`md:hidden fixed inset-0 z-50 transition ${
          menuOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        {/* Backdrop */}
        <div
          onClick={() => setMenuOpen(false)}
          className={`absolute inset-0 bg-black/30 transition-opacity duration-300 ${
            menuOpen ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* Drawer */}
        <div
          className={`
      absolute top-0 right-0 h-full w-[75%] bg-white
      transform transition-transform duration-300 ease-out
      ${menuOpen ? "translate-x-0" : "translate-x-full"}
    `}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b">
            <span className="text-sm font-semibold tracking-wide">Menu</span>
            <button
              onClick={() => setMenuOpen(false)}
              className="p-2 hover:bg-gray-100 transition"
            >
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <nav className="flex flex-col gap-6 px-5 py-6">
            {user?.role === "employee" && (
              <MobileLink to="/employee/dashboard" close={setMenuOpen}>
                Dashboard
              </MobileLink>
            )}

            {user?.role === "admin" && (
              <>
                <MobileLink to="/admin/dashboard" close={setMenuOpen}>
                  Admin
                </MobileLink>
                <MobileLink to="/employee/dashboard" close={setMenuOpen}>
                  Ansatte
                </MobileLink>
                <MobileLink to="/accountant/dashboard" close={setMenuOpen}>
                  Regnskap
                </MobileLink>
              </>
            )}

            <div className="mt-auto pt-6 border-t">
              {user ? (
                <button
                  onClick={() => {
                    handleLogout();
                    setMenuOpen(false);
                  }}
                  className="text-sm font-medium text-red-600 hover:text-red-700 transition cursor-pointer"
                >
                  Log out
                </button>
              ) : (
                <MobileLink to="/login" close={setMenuOpen}>
                  Login
                </MobileLink>
              )}
            </div>
          </nav>
        </div>
      </div>
    </nav>
  );
}

function NavLink({ to, children }: NavLinkProps) {
  return (
    <Link
      to={to}
      className="text-md font-semibold text-gray-700 hover:text-black transition"
    >
      {children}
    </Link>
  );
}

function MobileLink({ to, close, children }: MobileLinkProps) {
  return (
    <Link
      to={to}
      onClick={() => close(false)}
      className="text-md font-semibold text-gray-800"
    >
      {children}
    </Link>
  );
}

export default Navigation;
