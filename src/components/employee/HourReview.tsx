// src/components/hour/HourReview.tsx
import { useMemo, useState } from "react";
import { useUserHours, useUpdateHour, type HourRow } from "../../api/hours";
import { formatForInputLocal } from "../../utils/utils";
import { EditingItem } from "./editHours";
import { HourDisplayRows } from "./HourDisplay";
import { getWeeklySummary, getMonthlyTotal } from "./hourSummary";

type hourReviewProps = {
  userId: string | number;
  weekOffset: number;
  projects: Array<{ id: number; name: string }>;
  absence: Array<{ id: number; name: string }>;
};

export default function HourReview({
  userId,
  weekOffset,
  projects,
  absence,
}: hourReviewProps) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [expandedDays, setExpandedDays] = useState<Set<string>>(new Set());
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [breakMin, setBreakMin] = useState("");
  const [note, setNote] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const { data: rows = [], isLoading, isError, error } = useUserHours(userId);
  const updateMutation = useUpdateHour();

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

  const { groupedByDate, sortedDates, weeklyTotal, monday, sunday } = useMemo(
    () => getWeeklySummary(rows, weekOffset),
    [rows, weekOffset]
  );

  const monthName = new Date().toLocaleString("en-US", { month: "long" });

  const monthTotal = useMemo(() => getMonthlyTotal(rows, new Date()), [rows]);

  // Prefill fields when editing
  function handleEdit(row: HourRow) {
    setEditingId(row.idHours);
    setStart(formatForInputLocal(row.startTime));
    setEnd(formatForInputLocal(row.endTime));
    setBreakMin(row.breakMinutes?.toString() ?? "");
    setNote(row.note ?? "");
  }

  // Toggle dropdown for a specific day
  const toggleDay = (dateKey: string) => {
    setExpandedDays((prev) => {
      const next = new Set(prev);
      next.has(dateKey) ? next.delete(dateKey) : next.add(dateKey);
      return next;
    });
  };

  // Save (update API)
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

  return (
    <div className="mt-8">
      {/* Monthly summary */}
      <h2 className="mb-1 text-xl font-semibold">Your Logged Hours</h2>
      <p className="mb-4 text-sm text-gray-700">
        This month: {monthName}{" "}
        <span className="font-semibold text-blue-600">
          {monthTotal.toFixed(2)} hours
        </span>
      </p>

      {/* Weekly header */}
      <h3 className="mb-2 text-lg font-semibold">
        Week – {monday.toLocaleDateString()} → {sunday.toLocaleDateString()}
      </h3>

      {/* Expand / Collapse controls */}
      {sortedDates.length > 0 && (
        <div className="mb-4 flex justify-end space-x-2">
          <button
            onClick={expandAll}
            className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Expand All
          </button>
          <button
            onClick={collapseAll}
            className="px-3 py-1 text-sm bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
          >
            Collapse All
          </button>
        </div>
      )}

      {isLoading ? (
        <p>Loading your hours...</p>
      ) : isError ? (
        <p className="text-red-600">
          Error: {String((error as any)?.message || error)}
        </p>
      ) : sortedDates.length === 0 ? (
        <p>No logs for this week.</p>
      ) : (
        <>
          <div className="space-y-3">
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
                  className="border rounded-lg overflow-hidden bg-white shadow-sm"
                >
                  {/* Day header */}
                  <div
                    className="p-4 bg-gray-50 border-b cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => toggleDay(dateKey)}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-3">
                        <span className="font-semibold text-lg">
                          {date.toLocaleDateString(undefined, {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </span>
                        <span className="text-sm text-gray-500 bg-white px-2 py-1 rounded border">
                          {daylogs.length} entr
                          {daylogs.length === 1 ? "y" : "ies"}
                        </span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="font-bold text-blue-600">
                          {dayTotal.toFixed(2)} hours
                        </span>
                        <span className="text-gray-400 transform transition-transform">
                          {isExpanded ? "▲" : "▼"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Day entries */}
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

          <div className="mt-6 border-t pt-4 text-right text-lg font-semibold">
            <span>Weekly total: </span>
            <span className="text-blue-600">
              {weeklyTotal.toFixed(2)} hours
            </span>
          </div>
        </>
      )}
    </div>
  );
}
