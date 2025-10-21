import type { HourRow } from "../../api/hours";
import { hhmm } from "../../utils/utils";

export function HourDisplayRows({
  row,
  onEdit,
}: {
  row: HourRow;
  onEdit: () => void;
}) {
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
