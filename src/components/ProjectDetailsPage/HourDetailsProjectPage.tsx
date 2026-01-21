import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { GetProjectHours, GetProjectHoursByUser } from "../../api/reports";
import { GetProjectById } from "../../api/projects";
import { GetAbsenceById } from "../../api/absence";
import { timeHM } from "../../utils/utils";

interface HourlyProjectReportPageProps {
  projectCode?: string;
}

export default function HourlyProjectReportPage({
  projectCode: propProjectCode,
}: HourlyProjectReportPageProps) {
  const { projectCode: paramProjectCode } = useParams<{
    projectCode?: string;
  }>();
  const resolvedCode = propProjectCode || paramProjectCode;

  if (!resolvedCode) return <div>Mangler prosjekt-ID</div>;

  const { data: project, isLoading: isProjectLoading } =
    GetProjectById(resolvedCode);

  const { data: absence, isLoading: isAbsenceLoading } = GetAbsenceById(
    !project ? resolvedCode : undefined,
  );
  // ^ only run when project wasn't found (or implement with query enabled flag)

  // 3) Pick the numeric id to use for hours
  const entityId = project?.id ?? absence?.id;

  const {
    data: rows = [],
    isLoading: isRowsLoading,
    error: rowsError,
  } = GetProjectHours(entityId);

  const {
    data: byUser = [],
    isLoading: isByUserLoading,
    error: byUserError,
  } = GetProjectHoursByUser(entityId);

  const totals = useMemo(
    () => ({ total: rows.reduce((s, r) => s + Number(r.hoursWorked ?? 0), 0) }),
    [rows],
  );

  // Loading: either one could be resolving
  if (isProjectLoading || isAbsenceLoading) {
    return <div>Laster…</div>;
  }

  // If both failed / not found
  if (!project && !absence) {
    return <div>Prosjekt eller fravær ikke funnet</div>;
  }

  return (
    <div className="mx-auto max-w-6xl p-6">
      <div className="mb-6 rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-900">
            Sammendrag per bruker
          </h2>
        </div>

        {isByUserLoading ? (
          <p className="p-6 text-gray-600">Laster sammendrag…</p>
        ) : byUserError ? (
          <p className="p-6 text-red-600">
            {(byUserError as any)?.message ?? "Kunne ikke laste sammendrag"}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Bruker
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Timer
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {byUser.map((u) => (
                  <tr key={u.userId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {u.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right font-medium">
                      {Number(u.totalHours ?? 0).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50 border-t-2 border-gray-300">
                <tr>
                  <td className="px-6 py-4 text-sm font-bold text-gray-900">
                    Total
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-gray-900 text-right">
                    {byUser
                      .reduce((s, u) => s + Number(u.totalHours ?? 0), 0)
                      .toFixed(2)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>

      <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-900">
            Detaljerte oppføringer
          </h2>
        </div>

        {isRowsLoading ? (
          <p className="p-6 text-gray-600">Laster oppføringer…</p>
        ) : rowsError ? (
          <p className="p-6 text-red-600">
            {(rowsError as any)?.message ?? "Kunne ikke laste oppføringer"}
          </p>
        ) : !rows.length ? (
          <p className="p-6 text-gray-600">
            Ingen oppføringer i dette området.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dato
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Bruker
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Start
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Slutt
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pause (min)
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Timer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Notat
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {rows.map((r) => (
                  <tr key={r.idHours} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(r.startTime).toLocaleDateString("nb-NO")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {r.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {timeHM(r.startTime)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {timeHM(r.endTime)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                      {r.breakMinutes}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right font-medium">
                      {Number(r.hoursWorked ?? 0).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {r.note ?? ""}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50 border-t-2 border-gray-300">
                <tr>
                  <td
                    className="px-6 py-4 text-sm font-bold text-gray-900"
                    colSpan={5}
                  >
                    Total
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-gray-900 text-right">
                    {totals.total.toFixed(2)}
                  </td>
                  <td />
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
