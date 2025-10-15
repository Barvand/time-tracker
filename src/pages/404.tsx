import { Link } from "react-router-dom";
import { GiAirplaneDeparture } from "react-icons/gi";
import { Helmet } from "react-helmet";

/**
 *
 * @returns {JSX.Element} - renders the not found page.
 */
function NotFoundPage() {
  return (
    <>
      <Helmet>
        <title>Dagar - Page not found</title>
        <meta name="description" content="Page not found, try again later." />
      </Helmet>
      <div className="flex flex-col bg-page items-center justify-center min-h-screen text-center text-black">
        <div className="p-4 rounded">
          <h1 className="text-6xl font-bold">404</h1>
          <h2 className="text-3xl mt-2">Oops! Page Not Found</h2>
          <p className="text-lg mt-4">
            It looks like you did something wrong.
          </p>
          <div className="flex justify-center">
            <GiAirplaneDeparture size={120} className="text-black " />
          </div>
          <div className="mt-8">
            <Link
              to="/"
              className="bg-blue-500 text-white px-6 py-2 rounded-lg text-xl transition-all hover:bg-blue-600"
            >
              Go Back to Home
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default NotFoundPage;
