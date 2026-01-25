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
    </Modal>
  );
};

export default AddProjectModal;
