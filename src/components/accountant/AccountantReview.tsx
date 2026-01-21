import { useMemo, useState } from "react";
import { useAllUsersHours } from "../../api/hours";
import {
  getOffsetMonthDate,
  formatMonthName,
  getMonthlyUserSummary,
  calculateTotalHours,
} from "../../utils/dateHelpers";

type AccountantHourReviewProps = {
  users: Array<{ userId: number; name: string }>;
};

export default function AccountantHourReview({
  users,
}: AccountantHourReviewProps) {
  const [monthOffset, setMonthOffset] = useState(0);

  const { data: allHours = [], isLoading, isError, error } = useAllUsersHours();

  const userMap = useMemo(() => {
    const map: Record<number, string> = {};
    users.forEach((user) => {
      map[user.userId] = user.name;
    });
    return map;
  }, [users]);

  // Current month date (offset-based)
  const currentMonthDate = useMemo(
    () => getOffsetMonthDate(monthOffset),
    [monthOffset],
  );

  // Get monthly user summary using unified helper
  const currentMonthData = useMemo(
    () => getMonthlyUserSummary(allHours, currentMonthDate, userMap),
    [allHours, currentMonthDate, userMap],
  );

  // Calculate total using unified helper
  const monthTotal = useMemo(
    () => calculateTotalHours(currentMonthData),
    [currentMonthData],
  );

  const monthName = formatMonthName(currentMonthDate);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading hours data...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600">
          Error: {String((error as any)?.message || error)}
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Månedsoversikt - Timer
        </h2>

        {/* Month Navigation */}
        <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setMonthOffset(monthOffset - 1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Forrige måned"
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
                {monthName}
              </h3>
              <p className="text-sm text-gray-500">Totalt</p>
              <p className="text-3xl font-bold text-blue-600 mt-1">
                {monthTotal.toFixed(2)} timer
              </p>
            </div>

            <button
              onClick={() => setMonthOffset(monthOffset + 1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Neste måned"
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

          {/* Quick navigation to current month */}
          {monthOffset !== 0 && (
            <div className="mt-3 text-center">
              <button
                onClick={() => setMonthOffset(0)}
                className="text-sm text-blue-600 font-medium cursor-pointer hover:text-blue-900"
              >
                Gå til inneværende måned
              </button>
            </div>
          )}
        </div>

        {/* Employee Count */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
          <p className="text-sm text-gray-700">
            <span className="font-semibold">{currentMonthData.length}</span>{" "}
            {currentMonthData.length === 1 ? "ansatt" : "ansatte"} registrert
            for {monthName}
          </p>
        </div>
      </div>

      {/* Hours Table */}
      {currentMonthData.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
          <p className="text-gray-600">
            Ingen timer registrert for {monthName}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                  Ansattnavn
                </th>
                <th className="px-6 py-4 text-right text-sm font-bold text-gray-700 uppercase tracking-wider">
                  Arbeidstimer
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {currentMonthData.map((userSummary) => (
                <tr key={userSummary.userId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {userSummary.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-semibold text-gray-900">
                    {userSummary.totalHours.toFixed(2)} timer
                  </td>
                </tr>
              ))}
              {/* Month Total Row */}
              <tr className="bg-blue-50 font-bold">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  Totalt for {monthName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-blue-600">
                  {monthTotal.toFixed(2)} timer
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
