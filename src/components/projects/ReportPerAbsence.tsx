import { useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { GetAbsenceByCode } from "../../api/absence";
import { GetAbsenceHours, GetAbsenceHoursByUser } from "../../api/reports";

export default function AbsenceReportPage() {
  const { absenceCode } = useParams<{ absenceCode?: string }>();
  if (!absenceCode) return <div>Mangler fraværskode</div>;

  const {
    data: absence,
    isLoading: isAbsenceLoading,
    error: absenceError,
  } = GetAbsenceByCode(absenceCode);

  const absenceId = absence?.id;

  const rowsQ = GetAbsenceHours(absenceId);
  const byUserQ = GetAbsenceHoursByUser(absenceId);

  const rows = rowsQ.data ?? [];
  const byUser = byUserQ.data ?? [];

  const totals = useMemo(
    () => ({ total: rows.reduce((s, r) => s + Number(r.hoursWorked ?? 0), 0) }),
    [rows],
  );

  if (isAbsenceLoading) return <div>Laster fravær...</div>;
  if (absenceError) return <div>Feil ved lasting av fravær</div>;
  if (!absence) return <div>Fravær ikke funnet</div>;

  return (
    <div className="mx-auto max-w-7xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">
          Fraværsrapport #{absence.absenceCode} — {absence.name}
        </h1>
        <Link
          to="/admin/dashboard"
          className="text-blue-600 hover:text-blue-700 font-medium"
        >
          ← Tilbake til oversikt
        </Link>
      </div>

      {/* Header card */}
      <div className="mb-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <div className="text-sm font-medium text-gray-500 mb-1">
              Fraværsårsak
            </div>
            <div className="text-lg font-semibold text-gray-900">
              {absence.name}
            </div>
          </div>

          <div>
            <div className="text-sm font-medium text-gray-500 mb-1">Type</div>
            <span className="inline-flex items-center rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-800">
              Fravær
            </span>
          </div>

          <div>
            <div className="text-sm font-medium text-gray-500 mb-1">
              Totalt loggført (denne visningen)
            </div>
            <div className="text-lg font-semibold text-gray-900">
              {totals.total.toFixed(2)} t
            </div>
          </div>
        </div>
      </div>

      {/* Summary per user */}
      <div className="mb-6 rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-900">
            Sammendrag per bruker
          </h2>
        </div>

        {byUserQ.isLoading ? (
          <p className="p-6 text-gray-600">Laster sammendrag…</p>
        ) : byUserQ.error ? (
          <p className="p-6 text-red-600">
            {(byUserQ.error as any)?.message ?? "Kunne ikke laste sammendrag"}
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

      {/* Detailed rows */}
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-900">
            Detaljerte oppføringer
          </h2>
        </div>

        {rowsQ.isLoading ? (
          <p className="p-6 text-gray-600">Laster oppføringer…</p>
        ) : rowsQ.error ? (
          <p className="p-6 text-red-600">
            {(rowsQ.error as any)?.message ?? "Kunne ikke laste oppføringer"}
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

function timeHM(iso: string) {
  const d = new Date(iso);
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
}
