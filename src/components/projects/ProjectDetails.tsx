// src/pages/ProjectDetails.tsx
import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import ProjectForm from "../admin/ProjectForm";
import ConfirmModal from "../../utils/ConfirmModal";
import ProjectReportPage from "./ReportPerProject";
import {
  GetProjectById, // <-- correct name
  useUpdateProject,
  useDeleteProject,
} from "../../api/projects";

const ProjectDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // load the project
  const { data: project, isLoading, error } = GetProjectById(id);
  // mutations
  const updateProject = useUpdateProject();
  const deleteProject = useDeleteProject();

  // local edit form state
  const [editFormData, setEditFormData] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [success, setSuccess] = useState("");

  // when the project loads/changes, seed the edit form
  useEffect(() => {
    if (!project) return;
    setEditFormData({
      name: project.name ?? "",
      description: project.description ?? "",
      status: project.status ?? "",
      // inputs of type="date" prefer yyyy-MM-dd
      startDate: project.startDate ? project.startDate.slice(0, 10) : "",
      endDate: project.endDate ? project.endDate.slice(0, 10) : "",
    });
  }, [project]);

  const handleEditChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setEditFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess("");

    await updateProject.mutateAsync({
      id: id!,
      data: {
        name: editFormData.name,
        description: editFormData.description || null,
        status: editFormData.status || null,
        startDate: editFormData.startDate || null,
        endDate: editFormData.endDate || null,
      },
    });

    setSuccess("Prosjekt oppdatert.");
    setIsEditing(false);
    // cache is updated by the mutation hook; no manual refetch needed
  };

  const handleDelete = async () => {
    await deleteProject.mutateAsync(id!);
    navigate("/"); // back to dashboard
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
      case "aktiv":
        return "text-green-600";
      case "finished":
      case "avsluttet":
        return "text-blue-600";
      case "inaktiv":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "aktiv":
      case "active":
        return "Aktiv";
      case "avsluttet":
      case "finished":
        return "Avsluttet";
      case "inaktiv":
        return "Inaktiv";
      default:
        return status;
    }
  };

  if (isLoading) return <div className="p-4">Laster…</div>;
  if (error)
    return (
      <div className="text-red-500 p-4">
        {(error as any).message ?? "Kunne ikke hente prosjekt."}
      </div>
    );
  if (!project) return null;

  return (
    <>
      <div className="max-w-3xl mx-auto p-4">
        <Link to="/" className="text-blue-600 hover:underline">
          &larr; Tilbake til Dashboard
        </Link>

        {isEditing ? (
          <>
            <h2 className="text-xl font-semibold mt-6 mb-2">
              Rediger Prosjekt
            </h2>
            <ProjectForm
              formData={editFormData}
              onChange={handleEditChange}
              onSubmit={handleUpdate}
              isEdit
            />
            <button
              onClick={() => setIsEditing(false)}
              className="text-sm text-gray-600 mt-2 underline"
            >
              Avbryt
            </button>
          </>
        ) : (
          <>
            <div className="p-2">
              <h1 className="text-2xl font-bold mt-4">{project.name}</h1>

              <div className="mt-4 space-y-3 bg-gray-50 p-4 rounded">
                <div>
                  <span className="font-bold">Beskrivelse:</span>
                  <p className="mt-1">
                    {project.description || "Ingen beskrivelse"}
                  </p>
                </div>

                <div className="flex justify-between">
                  <span className="font-bold">Status:</span>
                  <span
                    className={`ml-2 font-bold border border-green-700 p-2 bg-green-200 text-green-600 rounded-2xl${getStatusColor(
                      project.status ?? ""
                    )}`}
                  >
                    {getStatusText(project.status ?? "")}
                  </span>
                </div>

                {project.startDate && (
                  <div>
                    <span className="font-bold">Oppstart:</span>
                    <span className="ml-2">
                      {new Date(project.startDate).toLocaleDateString("no-NO")}
                    </span>
                  </div>
                )}

                {project.endDate && (
                  <div>
                    <span className="font-bold">Ferdigstilt:</span>
                    <span className="ml-2">
                      {new Date(project.endDate).toLocaleDateString("no-NO")}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex space-x-4 mt-6">
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors"
                >
                  Rediger
                </button>
                <button
                  onClick={() => setShowConfirmModal(true)}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors"
                >
                  Slett
                </button>
              </div>
            </div>

            {showConfirmModal && (
              <ConfirmModal
                title={project.name}
                message="Er du sikker på at du vil slette dette prosjektet? Denne handlingen kan ikke angres."
                onConfirm={() => {
                  handleDelete();
                  setShowConfirmModal(false);
                }}
                onCancel={() => setShowConfirmModal(false)}
              />
            )}
          </>
        )}

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded mt-4">
            {success}
          </div>
        )}
      </div>

      {/* Reports for this project */}
      <ProjectReportPage id={id!} />
    </>
  );
};

export default ProjectDetails;
