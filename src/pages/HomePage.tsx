import { Link } from "react-router-dom";

function HomePage() {
  return (
    <div className="flex flex-col gap-5 max-w-2xl mx-auto p-4">
      <div className="flex flex-col items-center w-full pt-24 md:pt-32 pb-20 md:pb-40">
        <h1 className="font-bold text-6xl text-purple-600 gap-5">DAGAR </h1>
        <p className="text-2xl">ᛋᚴᛅᚾᛏᛁᚾᛅᚢᛁᛅᚾ ᛒᚱᚢᚢᛁᛋᛋ ᛘᛅᛏᛁ ᛅᚢᛅᛁᛚᛅᛒᛚᛁ ᚠᚢᚱ ᛁᚢᚢ</p>
      </div>
      <div>
        <p className="text-2xl">
          A documentation tool that helps your business grow and scale.
        </p>
      </div>
      <div className="flex flex-wrap sm:flex-nowrap justify-between gap-2 ">
        <div className="card border border-shadow bg-blue-50 border-blue-100 p-4 w-full">
          <div className="flex flex-col gap-2 ">
            <h2> Learn more about what we do and how can help you </h2>
            <button className="text-white font-semi-bold bg-purple-700 hover:bg-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-purple-600 dark:hover:bg-purple-700 pointer">
              Get in contact
            </button>
          </div>
        </div>
        <div className="card border border-shadow bg-blue-50 border-blue-100 p-4 w-full">
          <div className="flex flex-col gap-2">
            <h2> Already have an account with us, login below.</h2>
            <Link
              to="/login"
              className="text-white font-semi-bold bg-gray-700 hover:bg-gray-800 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-gray-600 dark:hover:bg-gray-700 pointer"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
