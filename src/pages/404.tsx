import { Link } from "react-router-dom";
import { Home, AlertCircle } from "lucide-react";

function NotFoundPage() {
  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
        <div className="max-w-md w-full text-center">
          <div className="mb-8">
            <AlertCircle className="w-24 h-24 mx-auto text-blue-500 mb-4" />
            <h1 className="text-7xl font-bold text-gray-800 mb-2">404</h1>
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              Page Not Found
            </h2>
            <p className="text-gray-600 mb-8">
              The page you're looking for doesn't exist or has been moved.
            </p>
          </div>

          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-blue-500 text-white px-6 py-3 rounded-lg font-medium transition-all hover:bg-blue-600 shadow-md hover:shadow-lg"
          >
            <Home className="w-5 h-5" />
            Back to Home
          </Link>
        </div>
      </div>
    </>
  );
}
export default NotFoundPage;
