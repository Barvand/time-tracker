// src/components/hour/HourReview.tsx
import { useMemo, useState } from "react";
import { useUserHours, useUpdateHour, type HourRow } from "../../api/hours";
import {
  isoWeekKey,
  mondayOfISOWeek,
  formatForInputLocal,
} from "../../utils/utils";
import { EditingItem } from "./editHours";
import { HourDisplayRows } from "./HourDisplay";

type hourReviewProps = {
  userId: string | number;
  weekOffset: number;
  projects: Array<{ id: number; name: string }>; // Change from projectName to projects array
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
    absence.forEach((absence) => {
      map[absence.id] = absence.name;
    });
    return map;
  }, [absence]);

  // ✅ Prefill fields when editing
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
      const newSet = new Set(prev);
      if (newSet.has(dateKey)) {
        newSet.delete(dateKey);
      } else {
        newSet.add(dateKey);
      }
      return newSet;
    });
  };

  // Group hours by date and filter for current week
  const { groupedByDate, total } = useMemo(() => {
    const grouped: Record<string, HourRow[]> = {};
    let weekTotal = 0;

    rows.forEach((row) => {
      // Check if row belongs to current week
      const rowWeekKey = isoWeekKey(new Date(row.startTime)).key;
      const { key: targetKey } = isoWeekKey(
        new Date(new Date().setDate(new Date().getDate() + weekOffset * 7))
      );

      if (rowWeekKey === targetKey) {
        const dateKey = new Date(row.startTime).toISOString().split("T")[0];
        if (!grouped[dateKey]) grouped[dateKey] = [];
        grouped[dateKey].push(row);
        weekTotal += Number(row.hoursWorked) || 0;
      }
    });

    // Sort logs within each day by start time
    Object.keys(grouped).forEach((dateKey) => {
      grouped[dateKey].sort(
        (a, b) =>
          new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
      );
    });

    return { groupedByDate: grouped, total: weekTotal };
  }, [rows, weekOffset]);

  // Sort dates chronologically
  const sortedDates = useMemo(() => {
    return Object.keys(groupedByDate).sort();
  }, [groupedByDate]);

  // Calculation week range
  const { year, week } = isoWeekKey(
    new Date(new Date().setDate(new Date().getDate() + weekOffset * 7))
  );
  const monday = mondayOfISOWeek(year, week);
  const sunday = new Date(monday);
  sunday.setUTCDate(monday.getUTCDate() + 6);

  // ✅ Handle save (update API call)
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

  // Expand all / collapse all functionality
  const expandAll = () => {
    const allDays = new Set(sortedDates);
    setExpandedDays(allDays);
  };

  const collapseAll = () => {
    setExpandedDays(new Set());
  };

  return (
    <div className="mt-8">
      <h2 className="mb-2 text-xl font-semibold">
        Your Logged Hours – {monday.toLocaleDateString()} →{" "}
        {sunday.toLocaleDateString()}
      </h2>

      {/* Expand/Collapse All Controls */}
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
                  {/* Day Header - Always clickable */}
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

                  {/* Day logs - Only show when expanded */}
                  {isExpanded && (
                    <div className="divide-y bg-white">
                      {daylogs.map((row) => {
                        // Get project name for this specific hour row
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
                            projectName={projectName} // Pass the specific project name
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
            <span className="text-gray-700">Weekly total: </span>
            <span className="text-blue-600">{total.toFixed(2)} hours</span>
          </div>
        </>
      )}
    </div>
  );
}
