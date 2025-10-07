// src/components/hour/HourReview.tsx
import { useMemo, useState } from "react";
import {
  useUserHours,
  useUpdateHour,
  useDeleteHour,
  type HourRow,
} from "../../api/hours";
import { isoWeekKey, mondayOfISOWeek } from "../../utils/date";

type Props = { userId: string | number; weekOffset: number };

function hhmm(dateIso: string) {
  const d = new Date(dateIso);
  return `${String(d.getHours()).padStart(2, "0")}:${String(
    d.getMinutes()
  ).padStart(2, "0")}`;
}

function EditingItem({
  row,
  onSave,
  onCancel,
  isUpdating,
}: {
  row: HourRow;
  onSave: (idHours: number, data: any) => void;
  onCancel: () => void;
  isUpdating: boolean;
}) {
  const [start, setStart] = useState(() => row.startTime.slice(0, 16));
  const [end, setEnd] = useState(() => row.endTime.slice(0, 16));
  const [breakMin, setBreakMin] = useState(String(row.breakMinutes ?? 0));
  const [note, setNote] = useState(row.note ?? "");

  const del = useDeleteHour(row.userId);

  return (
    <li className="rounded border bg-blue-50 p-3 shadow-sm">
      <div className="flex flex-wrap justify-between gap-2 mb-3">
        <span className="font-medium">
          {new Date(row.startTime).toLocaleDateString()}
        </span>
        <div className="flex gap-2">
          <button
            onClick={() =>
              onSave(row.idHours, {
                startTime: new Date(start).toISOString(),
                endTime: new Date(end).toISOString(),
                breakMinutes: Number(breakMin) || 0,
                note: note || undefined,
              })
            }
            disabled={isUpdating}
            className="px-2 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
          >
            {isUpdating ? "Saving..." : "Save"}
          </button>
          <button
            onClick={onCancel}
            disabled={isUpdating}
            className="px-2 py-1 text-xs bg-gray-600 text-white rounded hover:bg-gray-700 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              if (!confirm("Delete this entry?")) return;
              del.mutate({ idHours: row.idHours }, { onSuccess: onCancel });
            }}
            disabled={isUpdating}
            className="px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-gray-700 disabled:opacity-50"
          >
            Delete
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        <div>
          <label className="block text-xs font-medium mb-1">Start</label>
          <input
            type="datetime-local"
            value={start}
            onChange={(e) => setStart(e.target.value)}
            className="w-full px-2 py-1 text-sm border rounded"
            disabled={isUpdating}
          />
        </div>

        <div>
          <label className="block text-xs font-medium mb-1">Slutt</label>
          <input
            type="datetime-local"
            value={end}
            onChange={(e) => setEnd(e.target.value)}
            className="w-full px-2 py-1 text-sm border rounded"
            disabled={isUpdating}
          />
        </div>

        <div>
          <label className="block text-xs font-medium mb-1">Pause (min)</label>
          <input
            type="number"
            value={breakMin}
            onChange={(e) => setBreakMin(e.target.value)}
            className="w-full px-2 py-1 text-sm border rounded"
            min={0}
            disabled={isUpdating}
          />
        </div>

        <div>
          <label className="block text-xs font-medium mb-1">
            Timer (server)
          </label>
          <div className="px-2 py-1 text-sm bg-gray-100 rounded">
            {Number(row.hoursWorked).toFixed(2)} h
          </div>
        </div>
      </div>

      <div className="mt-3">
        <label className="block text-xs font-medium mb-1">Notat</label>
        <input
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Optional note..."
          className="w-full px-2 py-1 text-sm border rounded"
          disabled={isUpdating}
        />
      </div>
    </li>
  );
}

function ReadonlyItem({ row, onEdit }: { row: HourRow; onEdit: () => void }) {
  return (
    <li className="rounded border bg-white p-3 shadow-sm">
      <div className="flex flex-wrap justify-between gap-2">
        <span className="font-medium">
          {new Date(row.startTime).toLocaleDateString()}
        </span>
        <div className="flex items-center gap-2">
          <span className="text-sm opacity-80">
            {hhmm(row.startTime)} → {hhmm(row.endTime)}
          </span>
          <button
            onClick={onEdit}
            className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Edit
          </button>
        </div>
      </div>
      <div className="mt-1 text-sm opacity-80">
        {Number(row.hoursWorked).toFixed(2)} h • break {row.breakMinutes} min
      </div>
    </li>
  );
}

export default function HourReview({ userId, weekOffset }: Props) {
  const { data: rows = [], isLoading, isError, error } = useUserHours(userId);
  const updateMutation = useUpdateHour();
  const [editingId, setEditingId] = useState<number | null>(null);

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
                  onSave={(id, data) =>
                    updateMutation.mutate(
                      { idHours: id, data },
                      { onSuccess: () => setEditingId(null) }
                    )
                  }
                  onCancel={() => setEditingId(null)}
                  isUpdating={updateMutation.isPending}
                />
              ) : (
                <ReadonlyItem
                  key={row.idHours}
                  row={row}
                  onEdit={() => setEditingId(row.idHours)}
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
