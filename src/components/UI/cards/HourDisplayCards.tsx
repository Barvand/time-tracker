import { Link } from "react-router";
import type { HourRow } from "../../../api/hours";
import { hhmm } from "../../../utils/utils";

export function HourDisplayCards({
  row,
  onEdit,
  projectName,
  projectCode,
  absenceName,
}: {
  row: HourRow;
  onEdit: () => void;
  projectName: string;
  projectCode?: string;
  absenceName?: string;
}) {
  return (
    <li className="p-3 bg-gray-100">
      <div className="flex flex-col gap-1">
        {/* Line 1 — Project or Absence */}
        <div>
          {row.absenceId ? (
            <Link to={`/admin/absence/${row.absenceId}`} className="block">
              <span className="text-red-600">{absenceName}</span>
            </Link>
          ) : (
            <Link
              to={`/project/${projectCode}`}
              className="text-blue-900 font-semibold"
            >
              {projectCode} - {projectName}
            </Link>
          )}
        </div>

        {/* Line 2 — Hours + Edit button */}
        <div className="flex items-center justify-between">
          <span className="text-md font-semibold opacity-80">
            {hhmm(row.startTime)} → {hhmm(row.endTime)}
          </span>

          <button
            onClick={onEdit}
            className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Edit
          </button>
        </div>

        {/* Line 3 — Totals */}
        <div className="text-sm opacity-80">
          {Number(row.hoursWorked).toFixed(2)} h • break {row.breakMinutes} min
        </div>
      </div>
    </li>
  );
}
