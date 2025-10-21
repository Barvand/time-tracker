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

type Props = { userId: string | number; weekOffset: number };

export default function HourReview({ userId, weekOffset }: Props) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [breakMin, setBreakMin] = useState("");
  const [note, setNote] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const { data: rows = [], isLoading, isError, error } = useUserHours(userId);
  const updateMutation = useUpdateHour();

  // ✅ Prefill fields when editing
  function handleEdit(row: HourRow) {
    setEditingId(row.idHours);
    setStart(formatForInputLocal(row.startTime));
    setEnd(formatForInputLocal(row.endTime));
    setBreakMin(row.breakMinutes?.toString() ?? "");
    setNote(row.note ?? "");
  }

  // ✅ Handle save (update API call)
  async function handleSave(idHours: number, data: any) {
    try {
      setIsUpdating(true);
      await updateMutation.mutateAsync({ idHours, ...data });
      setEditingId(null);
    } catch (err) {
      console.error("Error updating hour:", err);
      alert("Could not update entry. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  }
  // Calculation week range
  const {
    key: targetKey,
    year,
    week,
  } = isoWeekKey(
    new Date(new Date().setDate(new Date().getDate() + weekOffset * 7))
  );
  const monday = mondayOfISOWeek(year, week);
  const sunday = new Date(monday);
  sunday.setUTCDate(monday.getUTCDate() + 6);

  const { items, total } = useMemo(() => {
    const selected = rows
      .filter((r) => isoWeekKey(new Date(r.startTime)).key === targetKey)
      .sort(
        (a, b) =>
          new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
      );
    const sum = selected.reduce((s, r) => s + (Number(r.hoursWorked) || 0), 0);
    return { items: selected, total: sum };
  }, [rows, targetKey]);

  return (
    <div className="mt-8">
      <h2 className="mb-2 text-xl font-semibold">
        Your Logged Hours – {monday.toLocaleDateString()} →{" "}
        {sunday.toLocaleDateString()}
      </h2>

      {isLoading ? (
        <p>Loading your hours...</p>
      ) : isError ? (
        <p className="text-red-600">
          Error: {String((error as any)?.message || error)}
        </p>
      ) : items.length === 0 ? (
        <p>No entries for this week.</p>
      ) : (
        <>
          <ul className="space-y-3">
            {items.map((row) =>
              editingId === row.idHours ? (
                <EditingItem
                  key={row.idHours}
                  row={row}
                  onSave={handleSave} // ✅ pass the function down
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
                  onEdit={() => handleEdit(row)}
                />
              )
            )}
          </ul>

          <div className="mt-3 border-t pt-3 text-right text-sm">
            <span className="font-medium">Weekly total: </span>
            {total.toFixed(2)} h
          </div>
        </>
      )}
    </div>
  );
}
