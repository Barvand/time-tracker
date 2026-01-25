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
import Modal from "../UI/modal/modal";
import type { ProjectFormData } from "../../types";

const ProjectDetails: React.FC = () => {
  const { projectCode } = useParams<{ projectCode: string }>();
  const navigate = useNavigate();

  // load the project
  const { data: project, isLoading, error } = GetProjectById(projectCode);
  // mutations
  const updateProject = useUpdateProject();
  const deleteProject = useDeleteProject();

  const [editFormData, setEditFormData] = useState<ProjectFormData | null>(
    null,
  );

  const [showEditModal, setShowEditModal] = useState(false);

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
        name: editFormData?.name,
        description: editFormData?.description || null,
        status: editFormData?.status || null,
        startDate: editFormData?.startDate || null,
        endDate: editFormData?.endDate || null,
        projectCode: editFormData?.projectCode || null,
      },
    });

    setSuccess("Prosjekt oppdatert.");
    setShowEditModal(false);
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

        <ProjectDetailsCard
          project={project}
          getStatusText={getStatusText}
          getStatusColor={getStatusColor}
          onEdit={() => setShowEditModal(true)}
          onDelete={() => setShowConfirmModal(true)}
        />

        {/* Edit Modal */}
        {/* Edit Modal */}
        {showEditModal && editFormData && (
          <Modal
            title="Rediger prosjekt"
            onClose={() => setShowEditModal(false)}
          >
            <ProjectForm
              formData={editFormData}
              onChange={handleEditChange}
              onSubmit={handleUpdate}
            >
              {/* Footer */}
              <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 border rounded hover:bg-gray-50"
                >
                  Avbryt
                </button>

                <button
                  type="submit"
                  disabled={updateProject.isLoading}
                  className="
        px-4 py-2
        bg-blue-600
        text-white
        rounded
        hover:bg-blue-700
        disabled:opacity-50
        disabled:cursor-not-allowed
      "
                >
                  {updateProject.isLoading ? "Lagrer..." : "Lagre"}
                </button>
              </div>
            </ProjectForm>
          </Modal>
        )}

        {/* Delete Confirm */}
        {showConfirmModal && (
          <ConfirmModal
            title={project.name}
            message="Er du sikker på at du vil slette dette prosjektet?"
            onConfirm={() => {
              handleDelete();
              setShowConfirmModal(false);
            }}
            onCancel={() => setShowConfirmModal(false)}
          />
        )}

        {success && (
          <SuccessMessage message={success} onClose={() => setSuccess("")} />
        )}
      </div>
    </>
  );
};

export default ProjectDetails;
