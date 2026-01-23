// src/pages/ProjectDetails.tsx
import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import ProjectForm from "../admin/ProjectForm";
import ConfirmModal from "../../utils/ConfirmModal";
import {
  GetProjectById,
  useUpdateProject,
  useDeleteProject,
} from "../../api/projects";
import ProjectDetailsCard from "./ProjectDetailsCard";
import SuccessMessage from "../UI/UX-messages/SuccessMessage";

const ProjectDetails: React.FC = () => {
  const { projectCode } = useParams<{ projectCode: string }>();
  const navigate = useNavigate();

  // load the project
  const { data: project, isLoading, error } = GetProjectById(projectCode);
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
      startDate: project.startDate ? project.startDate.slice(0, 10) : "",
      endDate: project.endDate ? project.endDate.slice(0, 10) : "",
      projectCode: project.projectCode ?? "",
    });
  }, [project]);

  const handleEditChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setEditFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess("");

    await updateProject.mutateAsync({
      id: project!.id, // ← Fixed: use project.id
      data: {
        name: editFormData.name,
        description: editFormData.description || null,
        status: editFormData.status || null,
        startDate: editFormData.startDate || null,
        endDate: editFormData.endDate || null,
        projectCode: editFormData.projectCode || null,
      },
    });

    setSuccess("Prosjekt oppdatert.");
    setIsEditing(false);
  };

  const handleDelete = async () => {
    await deleteProject.mutateAsync(project!.id);
    navigate("/admin/dashboard");
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
      <div className="max-w-6xl mx-auto p-4">
        <Link to="/admin/dashboard" className="text-blue-600 hover:underline">
          &larr; Tilbake til Dashboard
        </Link>

        {isEditing ? (
          <>
            <div className="relative">
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
                className="text-md text-red-600 mt-2 underline absolute cursor-pointer right-5 bottom-[-30px] hover:text-red-800 transition"
              >
                Avbryt
              </button>
            </div>
          </>
        ) : (
          <>
            <ProjectDetailsCard
              project={project}
              getStatusText={getStatusText}
              getStatusColor={getStatusColor}
              onEdit={() => setIsEditing(true)}
              onDelete={() => setShowConfirmModal(true)}
            />

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
          <SuccessMessage message={success} onClose={() => setSuccess("")} />
        )}
      </div>
    </>
  );
};

export default ProjectDetails;
