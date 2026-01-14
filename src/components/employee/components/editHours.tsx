import { useDeleteHour, type HourRow } from "../../../api/hours";

export function EditingHours({
  row,
  onSave,
  onCancel,
  setStart,
  isUpdating,
  start,
  end,
  breakMin,
  setBreakMin,
  note,
  setNote,
  setEnd,
}: {
  row: HourRow;
  onSave: (idHours: number, data: any) => void; // ✅ define type
  onCancel: () => void;
  isUpdating: boolean;
  start: string;
  end: string;
  breakMin: string;
  note: string;
  setBreakMin: (val: string) => void;
  setNote: (val: string) => void;
  setStart: (val: string) => void;
  setEnd: (val: string) => void;
}) {
  const del = useDeleteHour(row.userId);

  function datetimeLocalToISO(local: string | null) {
    if (!local) return null;
    return new Date(local).toISOString();
  }

  return (
    <li className="rounded border bg-blue-50 p-3 shadow-sm">
      <div className="flex flex-wrap justify-between gap-2 mb-3">
        <span className="font-medium">
          {new Date(row.startTime).toISOString()}
        </span>
        <div className="flex gap-2">
          <button
            onClick={() =>
              onSave(row.idHours, {
                startTime: datetimeLocalToISO(start),
                endTime: datetimeLocalToISO(end),
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
          <label className="block text-xs font-medium mb-1">Timer</label>
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
