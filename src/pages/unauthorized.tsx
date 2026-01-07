import { Link } from "react-router-dom";
import { Home, Lock } from "lucide-react";

function UnauthorizedPage() {
  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
        <div className="max-w-lg w-full text-center">
          <div className="mb-8">
            <Lock className="w-24 h-24 mx-auto text-amber-500 mb-4" />
            <h1 className="text-5xl font-bold text-gray-800 mb-2">403</h1>
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              Access Denied
            </h2>
            <p className="text-gray-600 mb-8">
              You don't have permission to access this page. Please log in with
              the appropriate credentials or contact your administrator.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/"
              className="inline-flex items-center gap-2 bg-blue-500 text-white px-6 py-3 rounded-lg font-medium transition-all hover:bg-blue-600 shadow-md hover:shadow-lg"
            >
              <Home className="w-5 h-5" />
              Go to Login
            </Link>
            <span className="text-gray-500 font-medium">or</span>
            <p className="text-gray-700">Contact your administrator</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default UnauthorizedPage;
