import { useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { GetProjectHours, GetProjectHoursByUser } from "../../api/reports";
import { GetProjectById } from "../../api/projects";

interface ProjectReportPageProps {
  id?: string;
}

export default function ProjectReportPage({ id }: ProjectReportPageProps) {
  // match your route param names exactly (usually ":projectId" or ":id")
  const { projectId } = useParams<{ projectId?: string; id?: string }>();
  const resolvedId = projectId ?? id;

  if (!resolvedId) {
    return <div>Missing project id</div>;
  }

  const {
    data: project,
    isLoading: isProjectLoading,
    error: projectError,
  } = GetProjectById(resolvedId);

  const {
    data: rows = [],
    isLoading: isRowsLoading,
    error: rowsError,
  } = GetProjectHours(resolvedId);

  const {
    data: byUser = [],
    isLoading: isByUserLoading,
    error: byUserError,
  } = GetProjectHoursByUser(resolvedId);

  const totals = useMemo(
    () => ({ total: rows.reduce((s, r) => s + Number(r.hoursWorked ?? 0), 0) }),
    [rows]
  );

  return (
    <div className="mx-auto max-w-6xl p-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">
          Project Report #{resolvedId}
          {project ? ` — ${project.name}` : ""}
        </h1>
        <Link to="/projects" className="text-blue-600 hover:underline">
          ← Back to projects
        </Link>
      </div>

      <div className="mb-6 rounded border p-4 bg-white">
        {isProjectLoading ? (
          <p>Loading project…</p>
        ) : projectError ? (
          <p className="text-red-600">
            {(projectError as any)?.message ?? "Failed to load project"}
          </p>
        ) : project ? (
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <div>
              <div className="text-sm opacity-70">Project name</div>
              <div className="font-medium">{project.name}</div>
            </div>
            <div>
              <div className="text-sm opacity-70">Status</div>
              <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium">
                {project.status ?? "—"}
              </span>
            </div>
            <div>
              <div className="text-sm opacity-70">Dates</div>
              <div>
                {formatDate(project.startDate) || "—"}{" "}
                <span className="opacity-60">→</span>{" "}
                {formatDate(project.endDate) || "ongoing"}
              </div>
            </div>
            <div>
              <div className="text-sm opacity-70">Total logged (this view)</div>
              <div className="font-medium">{totals.total.toFixed(2)} h</div>
            </div>
            {project.totalHours != null && (
              <div className="sm:col-span-2">
                <div className="text-sm opacity-70">
                  Total hours (project record)
                </div>
                <div className="font-medium">
                  {Number(project.totalHours).toFixed(2)} h
                </div>
              </div>
            )}
            {project.description && (
              <div className="sm:col-span-2">
                <div className="text-sm opacity-70">Description</div>
                <div>{project.description}</div>
              </div>
            )}
          </div>
        ) : null}
      </div>

      <div className="mb-6 overflow-x-auto rounded border">
        {isByUserLoading ? (
          <p className="p-3">Loading summary…</p>
        ) : byUserError ? (
          <p className="p-3 text-red-600">
            {(byUserError as any)?.message ?? "Failed to load summary"}
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-2 text-left">User</th>
                <th className="p-2 text-right">Hours</th>
              </tr>
            </thead>
            <tbody>
              {byUser.map((u) => (
                <tr key={u.userId} className="border-t">
                  <td className="p-2">{u.userName}</td>
                  <td className="p-2 text-right">
                    {Number(u.totalHours ?? 0).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-50 border-t">
              <tr>
                <td className="p-2 font-medium">Total</td>
                <td className="p-2 text-right font-medium">
                  {byUser
                    .reduce((s, u) => s + Number(u.totalHours ?? 0), 0)
                    .toFixed(2)}
                </td>
              </tr>
            </tfoot>
          </table>
        )}
      </div>

      {isRowsLoading ? (
        <p>Loading entries…</p>
      ) : rowsError ? (
        <p className="text-red-600">
          {(rowsError as any)?.message ?? "Failed to load entries"}
        </p>
      ) : !rows.length ? (
        <p>No entries in this range.</p>
      ) : (
        <div className="overflow-x-auto rounded border">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-2 text-left">Date</th>
                <th className="p-2 text-left">User</th>
                <th className="p-2 text-left">Start</th>
                <th className="p-2 text-left">End</th>
                <th className="p-2 text-right">Break (min)</th>
                <th className="p-2 text-right">Hours</th>
                <th className="p-2 text-left">Note</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.idHours} className="border-t">
                  <td className="p-2">
                    {new Date(r.startTime).toLocaleDateString()}
                  </td>
                  <td className="p-2">{r.userName}</td>
                  <td className="p-2">{timeHM(r.startTime)}</td>
                  <td className="p-2">{timeHM(r.endTime)}</td>
                  <td className="p-2 text-right">{r.breakMinutes}</td>
                  <td className="p-2 text-right">
                    {Number(r.hoursWorked ?? 0).toFixed(2)}
                  </td>
                  <td className="p-2">{r.note ?? ""}</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-50 border-t">
              <tr>
                <td className="p-2 font-medium" colSpan={5}>
                  Total
                </td>
                <td className="p-2 text-right font-medium">
                  {totals.total.toFixed(2)}
                </td>
                <td />
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </div>
  );
}

function formatDate(val?: string | null) {
  if (!val) return "";
  const d = new Date(val);
  if (Number.isNaN(d.getTime())) return String(val);
  return d.toLocaleDateString();
}

function timeHM(iso: string) {
  const d = new Date(iso);
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
}
