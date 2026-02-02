import { useMemo, useState } from "react";
import { useUserHours, useUpdateHour, type HourRow } from "../../../api/hours";
import { toDatetimeLocal } from "../../../utils/utils";
import { EditingHours } from "./editHours";
import { HourDisplayCards } from "../../UI/cards/HourDisplayCards";
import {
  getWeeklySummary,
  getMonthlySummary,
  getAllMonthlyTotals,
  getOffsetMonthDate,
  formatMonthName,
} from "../../../utils/dateHelpers";
import type { hourReviewProps, viewMode } from "../../../types";
import HeaderToggle from "./HeaderToggle";
import { GetProjects } from "../../../api/projects";
import { GetAbsenceData } from "../../../api/absence";
import { useQueryClient } from "@tanstack/react-query";

export default function HourReview({
  userId,
  weekOffset: initialWeekOffset,
  projects,
  userName,
}: hourReviewProps & { userName: string }) {
  // View state

  const [weekOffset, setWeekOffset] = useState(initialWeekOffset);
  const [monthOffset, setMonthOffset] = useState(0);
  const [viewMode, setViewMode] = useState<viewMode>("weekly");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [expandedDays, setExpandedDays] = useState<Set<string>>(new Set());
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [breakMin, setBreakMin] = useState("");
  const [note, setNote] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const { data: rows = [] } = useUserHours(userId);
  const { data: projectsData = [] } = GetProjects();
  const { data: absenceData = [] } = GetAbsenceData();
  const updateMutation = useUpdateHour();
  const queryClient = useQueryClient();

  // Maps
  const projectMap = useMemo(() => {
    const map: Record<number, string> = {};
    projects.forEach((project) => {
      map[project.id] = project.name;
    });
    return map;
  }, [projects]);

  // Maps
  const absenceMap = useMemo(() => {
    const map: Record<number, string> = {};
    absenceData.forEach((absence) => {
      map[absence.id] = absence.name;
    });
    return map;
  }, [absenceData]);

  // Weekly summary data
  const weeklySummary = useMemo(
    () => getWeeklySummary(rows, weekOffset),
    [rows, weekOffset],
  );

  // Current month date (offset-based)
  const currentMonthDate = useMemo(
    () => getOffsetMonthDate(monthOffset),
    [monthOffset],
  );

  // Monthly summary data
  const monthlySummary = useMemo(
    () => getMonthlySummary(rows, currentMonthDate),
    [rows, currentMonthDate],
  );

  const allMonths = useMemo(() => getAllMonthlyTotals(rows), [rows]);

  // Choose which data to show based on view mode
  const currentSummary = viewMode === "weekly" ? weeklySummary : monthlySummary;
  const { groupedByDate, sortedDates, total } = currentSummary;

  // Handlers
  function handleEdit(row: HourRow) {
    setEditingId(row.idHours);
    setStart(toDatetimeLocal(row.startTime));
    setEnd(toDatetimeLocal(row.endTime));
    setBreakMin(row.breakMinutes?.toString() ?? "");
    setNote(row.note ?? "");
  }

  const toggleDay = (dateKey: string) => {
    setExpandedDays((prev) => {
      const next = new Set(prev);
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      next.has(dateKey) ? next.delete(dateKey) : next.add(dateKey);
      return next;
    });
  };

  async function handleSave(idHours: number, data: any) {
    try {
      setIsUpdating(true);
      await updateMutation.mutateAsync({ idHours, data });
      await queryClient.invalidateQueries({
        queryKey: ["hours", "all"],
      });
      setEditingId(null);
      alert("Entry updated successfully.");
    } catch (err) {
      console.error("Error updating hour:", err);
      alert("Could not update entry. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  }

  const monthName = formatMonthName(currentMonthDate);
  const weekRange = `${weeklySummary.startDate.toLocaleDateString("nb-NO", {
    month: "short",
    day: "numeric",
  })} – ${weeklySummary.endDate.toLocaleDateString("nb-NO", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })}`;

  return (
    <div className="mt-8 max-w-6xl mx-auto">
      <HeaderToggle
        viewMode={viewMode}
        setViewMode={setViewMode}
        weekOffset={weekOffset}
        setWeekOffset={setWeekOffset}
        monthOffset={monthOffset}
        setMonthOffset={setMonthOffset}
        weekRange={weekRange}
        monthName={monthName}
        total={total}
        name={userName}
      />

      <>
        {/* Day Entries */}
        <div className="space-y-3 mb-6 mt-6">
          {sortedDates.map((dateKey) => {
            const daylogs = groupedByDate[dateKey];
            const isExpanded = expandedDays.has(dateKey);
            const dayTotal = daylogs.reduce(
              (sum, row) => sum + (Number(row.hoursWorked) || 0),
              0,
            );
            const date = new Date(dateKey);

            return (
              <div
                key={dateKey}
                className="rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Day Header */}
                <div
                  className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 cursor-pointer hover:from-gray-100 hover:to-gray-200 transition-colors"
                  onClick={() => toggleDay(dateKey)}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-base text-gray-900">
                        {date.toLocaleDateString("nb-NO", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                      <span className="text-base text-gray-600 bg-white px-2.5 mr-2 py-1 border font-medium">
                        {daylogs.length}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-blue-600 text-base">
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
                  <div className="divide-y ">
                    {daylogs.map((row) => {
                      const projectName =
                        projectMap[row.projectsId] || "Unknown Project";
                      const absenceName =
                        absenceMap[Number(row.absenceId)] || "Unknown Absence";
                      return editingId === row.idHours ? (
                        <EditingHours
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
                        <HourDisplayCards
                          key={row.idHours}
                          row={row}
                          projectName={projectName}
                          absenceName={absenceName}
                          projectCode={
                            projectsData.find((p) => p.id === row.projectsId)
                              ?.projectCode || "—"
                          }
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
              {total.toFixed(2)} hours
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
    </div>
  );
}
