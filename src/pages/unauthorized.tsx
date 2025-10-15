import { Link } from "react-router-dom";
import { GiAirplaneDeparture } from "react-icons/gi";
import { Helmet } from "react-helmet";
function UnAuthorizedPage() {
  return (
    <>
      <Helmet>
        <title>Dagar</title>
        <meta
          name="description"
          content="Access denied, login or see you administrator."
        />
      </Helmet>
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className=" p-4 rounded">
          <h1 className="text-4xl mt-2">Sorry, this page is not for you</h1>
          <p className="text-lg mt-4">But don't worry!</p>
          <div className="flex justify-center">
            <GiAirplaneDeparture size={120} className="text-accentColor " />
          </div>
          <div className="mt-8 flex gap-2 items-center justify-center">
            <Link
              to="/login"
              className="bg-blue-500 text-white px-6 py-2 rounded-lg text-xl transition-all hover:bg-blue-600"
            >
              Login here!
            </Link>
            <p className="text-xl font-bold"> Or </p>
            <h2 className="text-2xl"> Please contact your administrator</h2>
          </div>
        </div>
      </div>
    </>
  );
}

export default UnAuthorizedPage;
