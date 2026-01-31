import type { viewMode } from "../../../types";

type HeaderToggleProps = {
  setViewMode: (mode: viewMode) => void;
  viewMode: viewMode;
  weekOffset: number;
  setWeekOffset: (offset: number) => void;
  monthOffset: number;
  setMonthOffset: (offset: number) => void;
  name: string;
};

export default function HeaderToggle({
  setViewMode,
  viewMode,
  weekOffset,
  setWeekOffset,
  monthOffset,
  setMonthOffset,
  weekRange,
  monthName,
  total,
}: HeaderToggleProps & {
  weekRange: string;
  monthName: string;
  total: number;
}) {
  return (
    <div className="mt-6 sm:mt-8 max-w-6xl mx-auto px-2 sm:px-4">
      {/* Overskrift */}
      <div className="mb-5 sm:mb-6">
        {/* Bytte mellom uke/måned */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <button
            onClick={() => setViewMode("weekly")}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-sm sm:text-base font-medium transition-colors ${
              viewMode === "weekly"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Ukentlig visning
          </button>

          <button
            onClick={() => setViewMode("monthly")}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-sm sm:text-base font-medium transition-colors ${
              viewMode === "monthly"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Månedlig visning
          </button>
        </div>
      </div>

      {/* Periode-navigasjon */}
      <div className="bg-white rounded-lg shadow-sm border p-3 sm:p-4">
        <div className="flex items-center justify-between gap-2">
          {/* Forrige */}
          <button
            onClick={() =>
              viewMode === "weekly"
                ? setWeekOffset(weekOffset - 1)
                : setMonthOffset(monthOffset - 1)
            }
            className="p-2 sm:p-2.5 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Forrige periode"
          >
            <svg
              className="w-5 h-5 sm:w-6 sm:h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          {/* Midtseksjon */}
          <div className="text-center flex-1 px-1">
            <h3 className="text-sm sm:text-lg font-semibold text-gray-900 truncate">
              {viewMode === "weekly" ? weekRange : monthName}
            </h3>

            <p className="text-xs sm:text-sm text-gray-500">
              {viewMode === "weekly"
                ? "Totalt denne uken"
                : "Totalt denne måneden"}
            </p>

            <p className="text-xl sm:text-3xl font-bold text-blue-600 mt-0.5 sm:mt-1">
              {total.toFixed(2)} timer
            </p>
          </div>

          {/* Neste */}
          <button
            onClick={() =>
              viewMode === "weekly"
                ? setWeekOffset(weekOffset + 1)
                : setMonthOffset(monthOffset + 1)
            }
            className="p-2 sm:p-2.5 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Neste periode"
          >
            <svg
              className="w-5 h-5 sm:w-6 sm:h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
