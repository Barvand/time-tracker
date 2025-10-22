import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="relative flex flex-col items-center justify-center text-center bg-gradient-to-br from-orange-500 to-orange-700 text-white py-24 px-6 overflow-hidden">
      <div className="w-full">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-4 tracking-tight">
          Total Timing
        </h1>
        <p className="text-lg md:text-xl mb-8 font-semibold">
          Empower your workforce with smarter time tracking, project insights,
          and effortless scheduling. All with one app.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/login"
            className="bg-white text-orange-600 font-semibold py-3 px-8 shadow-md hover:bg-orange-100 transition cursor-pointer"
          >
            Get Started
          </Link>
          <button className="border border-white text-white font-semibold py-3 px-8 hover:bg-white hover:text-orange-600 transition cursor-pointer">
            Learn More
          </button>
        </div>
      </div>

      {/* Decorative background shapes */}
      <div className="absolute inset-0 -z-10 opacity-20">
        <div className="absolute -top-32 -left-32 w-80 h-80 bg-white/20 l blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 blur-3xl"></div>
      </div>
    </section>
  );
}
