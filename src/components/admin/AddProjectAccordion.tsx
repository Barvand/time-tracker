import React from "react";
import type { UseMutationResult } from "@tanstack/react-query";
import type { AxiosError } from "axios";

import ProjectForm from "./ProjectForm";
import Modal from "../UI/modal/modal";
import ErrorMessage from "../UI/UX-messages/ErrorMessage";
import SuccessMessage from "../UI/UX-messages/SuccessMessage";
import type { ProjectFormData } from "../../types";

interface AddProjectModalProps {
  open: boolean;
  onClose: () => void;

  formData: ProjectFormData;
  setFormData: React.Dispatch<React.SetStateAction<ProjectFormData>>;

  createMutation: UseMutationResult<any, unknown, ProjectFormData, unknown>;
}

const AddProjectModal: React.FC<AddProjectModalProps> = ({
  open,
  onClose,
  formData,
  setFormData,
  createMutation,
}) => {
  if (!open) return null;

  const apiErrorMessage =
    (createMutation.error as AxiosError<any>)?.response?.data?.message ??
    (createMutation.error as AxiosError<any>)?.response?.data?.errors?.[0]
      ?.message ??
    "Kunne ikke opprette prosjekt.";

  return (
    <Modal title="Nytt prosjekt" onClose={onClose}>
      <ProjectForm
        formData={formData}
        onChange={(
          e: React.ChangeEvent<
            HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
          >,
        ) => {
          const { name, value } = e.target;

          setFormData((prev) => ({
            ...prev,
            [name]: value,
          }));
        }}
        onSubmit={(e: React.FormEvent) => {
          e.preventDefault();

          if (!formData.name.trim()) return;

          createMutation.mutate(formData, {
            onSuccess: () => {
              setTimeout(() => {
                onClose();
              }, 800);
            },
          });
        }}
      />

      {/* Messages */}
      <div className="mt-3">
        {createMutation.isError && (
          <ErrorMessage
            message={apiErrorMessage}
            onClose={createMutation.reset}
          />
        )}

        {createMutation.isSuccess && (
          <SuccessMessage
            message="Prosjektet ble opprettet!"
            onClose={createMutation.reset}
          />
        )}
      </div>

      {/* Footer */}
      <div className="flex justify-end gap-3 mt-6">
        <button
          onClick={onClose}
          className="px-4 py-2 border rounded hover:bg-gray-50"
        >
          Avbryt
        </button>

        <button
          onClick={() => createMutation.mutate(formData)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Lagre
        </button>
      </div>
    </Modal>
  );
};

export default AddProjectModal;
