import type { viewMode } from "../../../types";

type HeaderToggleProps = {
  setViewMode: (mode: viewMode) => void;
  viewMode: viewMode;
  weekOffset: number;
  setWeekOffset: (offset: number) => void;
  monthOffset: number;
  setMonthOffset: (offset: number) => void;
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
    <div className="mt-8 max-w-6xl mx-auto">
      {/* Header with View Toggle */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Your Logged Hours
        </h2>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-2 mb-4">
          <button
            onClick={() => setViewMode("weekly")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              viewMode === "weekly"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Weekly View
          </button>
          <button
            onClick={() => setViewMode("monthly")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              viewMode === "monthly"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Monthly View
          </button>
        </div>
      </div>

      {/* Period Navigation */}
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() =>
              viewMode === "weekly"
                ? setWeekOffset(weekOffset - 1)
                : setMonthOffset(monthOffset - 1)
            }
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Previous period"
          >
            <svg
              className="w-6 h-6"
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

          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900">
              {viewMode === "weekly" ? weekRange : monthName}
            </h3>
            <p className="text-sm text-gray-500">
              {viewMode === "weekly" ? "Weekly Total" : "Monthly Total"}
            </p>
            <p className="text-3xl font-bold text-blue-600 mt-1">
              {total.toFixed(2)} hrs
            </p>
          </div>

          <button
            onClick={() =>
              viewMode === "weekly"
                ? setWeekOffset(weekOffset + 1)
                : setMonthOffset(monthOffset + 1)
            }
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Next period"
          >
            <svg
              className="w-6 h-6"
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
