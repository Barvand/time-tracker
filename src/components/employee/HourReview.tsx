// src/components/hour/HourReview.tsx
import { useMemo, useState } from "react";
import { useUserHours, useUpdateHour, type HourRow } from "../../api/hours";
import { formatForInputLocal } from "../../utils/utils";
import { EditingItem } from "./editHours";
import { HourDisplayRows } from "./HourDisplay";
import {
  getWeeklySummary,
  getAllMonthlyTotals,
  getMonthlySummary,
} from "./hourSummary";

type hourReviewProps = {
  userId: string | number;
  weekOffset: number;
  projects: Array<{ id: number; name: string }>;
  absence: Array<{ id: number; name: string }>;
};

type ViewMode = "weekly" | "monthly";

export default function HourReview({
  userId,
  weekOffset: initialWeekOffset,
  projects,
  absence,
}: hourReviewProps) {
  // View state
  const [viewMode, setViewMode] = useState<ViewMode>("weekly");
  const [weekOffset, setWeekOffset] = useState(initialWeekOffset);
  const [monthOffset, setMonthOffset] = useState(0);

  // Edit state
  const [editingId, setEditingId] = useState<number | null>(null);
  const [expandedDays, setExpandedDays] = useState<Set<string>>(new Set());
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [breakMin, setBreakMin] = useState("");
  const [note, setNote] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const { data: rows = [], isLoading, isError, error } = useUserHours(userId);
  const updateMutation = useUpdateHour();

  // Maps
  const projectMap = useMemo(() => {
    const map: Record<number, string> = {};
    projects.forEach((project) => {
      map[project.id] = project.name;
    });
    return map;
  }, [projects]);

  const absenceMap = useMemo(() => {
    const map: Record<number, string> = {};
    absence.forEach((a) => {
      map[a.id] = a.name;
    });
    return map;
  }, [absence]);

  // Weekly summary data
  const {
    groupedByDate: weeklyGroupedByDate,
    sortedDates: weeklySortedDates,
    weeklyTotal,
    monday,
    sunday,
  } = useMemo(() => getWeeklySummary(rows, weekOffset), [rows, weekOffset]);

  // Current month date (offset-based)
  const currentMonthDate = useMemo(() => {
    const date = new Date();
    date.setMonth(date.getMonth() + monthOffset);
    return date;
  }, [monthOffset]);

  // Monthly summary data (for listing all days in the selected month)
  const {
    groupedByDate: monthlyGroupedByDate,
    sortedDates: monthlySortedDates,
    weeklyTotal: monthTotal, // total hours in that month
    monday: monthStart,
    sunday: monthEnd,
  } = useMemo(
    () => getMonthlySummary(rows, currentMonthDate),
    [rows, currentMonthDate]
  );

  const allMonths = useMemo(() => getAllMonthlyTotals(rows), [rows]);

  // Choose which grouped data to show based on view mode
  const groupedByDate =
    viewMode === "weekly" ? weeklyGroupedByDate : monthlyGroupedByDate;

  const sortedDates =
    viewMode === "weekly" ? weeklySortedDates : monthlySortedDates;

  // Handlers
  function handleEdit(row: HourRow) {
    setEditingId(row.idHours);
    setStart(formatForInputLocal(row.startTime));
    setEnd(formatForInputLocal(row.endTime));
    setBreakMin(row.breakMinutes?.toString() ?? "");
    setNote(row.note ?? "");
  }

  const toggleDay = (dateKey: string) => {
    setExpandedDays((prev) => {
      const next = new Set(prev);
      next.has(dateKey) ? next.delete(dateKey) : next.add(dateKey);
      return next;
    });
  };

  async function handleSave(idHours: number, data: any) {
    try {
      setIsUpdating(true);
      await updateMutation.mutateAsync({ idHours, data });
      setEditingId(null);
      alert("Entry updated successfully.");
    } catch (err) {
      console.error("Error updating hour:", err);
      alert("Could not update entry. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  }

  const expandAll = () => setExpandedDays(new Set(sortedDates));
  const collapseAll = () => setExpandedDays(new Set());

  // Format helpers
  const monthName = currentMonthDate.toLocaleString("en-US", {
    month: "long",
    year: "numeric",
  });

  const weekRange = `${monday.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  })} – ${sunday.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })}`;

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
                {(viewMode === "weekly" ? weeklyTotal : monthTotal).toFixed(2)}{" "}
                hrs
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

          {/* Quick navigation to current period */}
          {(weekOffset !== 0 || monthOffset !== 0) && (
            <div className="mt-3 text-center">
              <button
                onClick={() => {
                  setWeekOffset(0);
                  setMonthOffset(0);
                }}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Return to current {viewMode === "weekly" ? "week" : "month"}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Expand/Collapse Controls */}
      {sortedDates.length > 0 && (
        <div className="mb-4 flex justify-end gap-2">
          <button
            onClick={expandAll}
            className="px-3 py-1.5 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Expand All
          </button>
          <button
            onClick={collapseAll}
            className="px-3 py-1.5 text-sm bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            Collapse All
          </button>
        </div>
      )}

      {/* Content Area */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your hours...</p>
          </div>
        </div>
      ) : isError ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">
            Error: {String((error as any)?.message || error)}
          </p>
        </div>
      ) : sortedDates.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
          <p className="text-gray-600">
            No logs for this {viewMode === "weekly" ? "week" : "month"}.
          </p>
        </div>
      ) : (
        <>
          {/* Day Entries */}
          <div className="space-y-3 mb-6">
            {sortedDates.map((dateKey) => {
              const daylogs = groupedByDate[dateKey];
              const isExpanded = expandedDays.has(dateKey);
              const dayTotal = daylogs.reduce(
                (sum, row) => sum + (Number(row.hoursWorked) || 0),
                0
              );
              const date = new Date(dateKey);

              return (
                <div
                  key={dateKey}
                  className="border rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow"
                >
                  {/* Day Header */}
                  <div
                    className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b cursor-pointer hover:from-gray-100 hover:to-gray-200 transition-colors"
                    onClick={() => toggleDay(dateKey)}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <span className="font-semibold text-lg text-gray-900">
                          {date.toLocaleDateString(undefined, {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </span>
                        <span className="text-xs text-gray-600 bg-white px-2.5 py-1 rounded-full border font-medium">
                          {daylogs.length}{" "}
                          {daylogs.length === 1 ? "entry" : "entries"}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-blue-600 text-lg">
                          {dayTotal.toFixed(2)} hrs
                        </span>
                        <span className="text-gray-400 transform transition-transform">
                          {isExpanded ? "▲" : "▼"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Day Entries */}
                  {isExpanded && (
                    <div className="divide-y bg-white">
                      {daylogs.map((row) => {
                        const projectName =
                          projectMap[row.projectsId] || "Unknown Project";
                        const absenceName = absenceMap[row.absenceId];

                        return editingId === row.idHours ? (
                          <EditingItem
                            key={row.idHours}
                            row={row}
                            onSave={handleSave}
                            onCancel={() => setEditingId(null)}
                            isUpdating={isUpdating}
                            start={start}
                            setStart={setStart}
                            end={end}
                            setEnd={setEnd}
                            breakMin={breakMin}
                            setBreakMin={setBreakMin}
                            note={note}
                            setNote={setNote}
                          />
                        ) : (
                          <HourDisplayRows
                            key={row.idHours}
                            row={row}
                            projectName={projectName}
                            absenceName={absenceName}
                            onEdit={() => handleEdit(row)}
                          />
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Period Total Summary */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-gray-900">
                {viewMode === "weekly" ? "Weekly" : "Monthly"} Total
              </span>
              <span className="text-3xl font-bold text-blue-600">
                {(viewMode === "weekly" ? weeklyTotal : monthTotal).toFixed(2)}{" "}
                hours
              </span>
            </div>
          </div>

          {/* All Months Overview (Monthly View Only) */}
          {viewMode === "monthly" && allMonths.length > 0 && (
            <div className="mt-6 bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                All Months Overview
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {allMonths.map((month) => {
                  const isCurrentMonth =
                    month.year === currentMonthDate.getFullYear() &&
                    month.month === currentMonthDate.getMonth();

                  return (
                    <button
                      key={`${month.year}-${month.month}`}
                      onClick={() => {
                        const now = new Date();
                        const targetDate = new Date(month.year, month.month);
                        const diffMonths =
                          (targetDate.getFullYear() - now.getFullYear()) * 12 +
                          (targetDate.getMonth() - now.getMonth());
                        setMonthOffset(diffMonths);
                      }}
                      className={`p-4 rounded-lg text-left transition-all ${
                        isCurrentMonth
                          ? "bg-blue-100 border-2 border-blue-500 shadow-md"
                          : "bg-gray-50 border border-gray-200 hover:bg-gray-100 hover:shadow-sm"
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span
                          className={`font-medium ${
                            isCurrentMonth ? "text-blue-900" : "text-gray-700"
                          }`}
                        >
                          {month.label}
                        </span>
                        <span
                          className={`text-lg font-semibold ${
                            isCurrentMonth ? "text-blue-600" : "text-gray-900"
                          }`}
                        >
                          {month.total.toFixed(1)} hrs
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
