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
import { useQueryClient } from "@tanstack/react-query";

const ProjectDetails: React.FC = () => {
  const { projectCode } = useParams<{ projectCode: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
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
        status: editFormData?.status,
        startDate: editFormData?.startDate || null,
        endDate: editFormData?.endDate || null,
        projectCode: editFormData?.projectCode || null,
      },
    });

    setSuccess("Prosjekt oppdatert.");
    setShowEditModal(false);
    queryClient.invalidateQueries({ queryKey: ["project"] });
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
        <div className="flex items-center justify-between mb-4">
          <Link to="/admin/dashboard" className="text-blue-600 hover:underline">
            &larr; Tilbake til Dashboard
          </Link>
          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowEditModal(true)}
              className="px-3 py-1.5 text-sm border hover:bg-blue-900 transition cursor-pointer bg-blue-600 text-white"
            >
              Rediger
            </button>

            <button
              onClick={() => setShowConfirmModal(true)}
              className="px-3 py-1.5 text-sm text-red-600 hover:text-red-700 transition cursor-pointer"
            >
              Slett
            </button>
          </div>
        </div>
        <ProjectDetailsCard
          project={project}
          getStatusText={getStatusText}
          getStatusColor={getStatusColor}
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
                  disabled={updateProject.isPending}
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
                  {updateProject.isPending ? "Lagrer..." : "Lagre"}
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
