import type { Project } from "../../types";

interface Props {
  project: Project;
  getStatusText: (status: string) => string;
  getStatusColor: (status: string) => string;
  onEdit: () => void;
  onDelete: () => void;
}

function ProjectDetailsCard({
  project,
  getStatusText,
  getStatusColor,
  onEdit,
  onDelete,
}: Props) {
  return (
    <section className="mt-6 bg-gray-50 p-6">
      {/* Header row */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold leading-tight">
            <span className="text-gray-800">{project.projectCode}</span>
            <span className="mx-2 text-gray-800">–</span>
            {project.name}
          </h1>

          {/* Meta */}
          <dl className="mt-3 flex flex-wrap gap-x-8 gap-y-2 text-sm">
            <div className="flex gap-2">
              <dt className="text-gray-500">Status</dt>
              <dd className={getStatusColor(project.status ?? "")}>
                {getStatusText(project.status ?? "")}
              </dd>
            </div>

            {project.startDate && (
              <div className="flex gap-2">
                <dt className="text-gray-500">Oppstart</dt>
                <dd className="text-gray-800">
                  {new Date(project.startDate).toLocaleDateString("no-NO")}
                </dd>
              </div>
            )}

            {project.endDate && (
              <div className="flex gap-2">
                <dt className="text-gray-500">Ferdigstilt</dt>
                <dd className="text-gray-800">
                  {new Date(project.endDate).toLocaleDateString("no-NO")}
                </dd>
              </div>
            )}
          </dl>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onEdit}
            className="px-3 py-1.5 text-sm border hover:bg-white transition"
          >
            Rediger
          </button>

          <button
            onClick={onDelete}
            className="px-3 py-1.5 text-sm text-red-600 hover:text-red-700 transition"
          >
            Slett
          </button>
        </div>
      </div>

      {/* Description */}
      <div className="mt-6 max-w-3xl">
        <p className="text-xs text-gray-500 mb-1">Beskrivelse</p>
        <p className="text-sm text-gray-800">
          {project.description || "Ingen beskrivelse"}
        </p>
      </div>
    </section>
  );
}

export default ProjectDetailsCard;
