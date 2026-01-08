import React from "react";
import type { UseMutationResult } from "@tanstack/react-query";
import ProjectForm from "./ProjectForm";
import type { AxiosError } from "axios";

export type ProjectStatus = "inaktiv" | "aktiv" | "avsluttet";

export interface ProjectFormData {
  name: string;
  description: string;
  status: ProjectStatus;
  startDate: string;
  completionDate: string;
  projectCode: string;
}

interface AddProjectAccordionProps {
  showAddProject: boolean;
  setShowAddProject: React.Dispatch<React.SetStateAction<boolean>>;
  formData: ProjectFormData;
  setFormData: React.Dispatch<React.SetStateAction<ProjectFormData>>;
  // created project type can be widened if you have a Project type available
  createMutation: UseMutationResult<any, unknown, ProjectFormData, unknown>;
}

const AddProjectAccordion: React.FC<AddProjectAccordionProps> = ({
  showAddProject,
  setShowAddProject,
  formData,
  setFormData,
  createMutation,
}) => {
  return (
    <div className="mb-6">
      <button
        onClick={() => setShowAddProject((prev) => !prev)}
        className="w-full text-left flex justify-between items-center bg-gray-100 px-4 py-3 rounded hover:bg-gray-200 transition"
      >
        <span className="text-xl font-semibold">Legg til nytt prosjekt</span>
        <svg
          className={`w-5 h-5 transform transition-transform duration-300 ${
            showAddProject ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          showAddProject ? "max-h-[1000px] mt-4" : "max-h-0"
        }`}
      >
        <div className="p-4 bg-gray-50 rounded border">
          <ProjectForm
            formData={formData}
            onChange={(
              e: React.ChangeEvent<
                HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
              >
            ) => {
              const { name, value } = e.target;
              setFormData((prev) => ({ ...prev, [name]: value }));
            }}
            onSubmit={(e: React.FormEvent) => {
              e.preventDefault();
              if (!formData.name.trim()) return;
              createMutation.mutate(formData);
            }}
          />

          {createMutation.isError && (
            <div className="mt-2 text-red-600 text-sm">
              {(createMutation.error as AxiosError<any>)?.response?.data
                ?.message ??
                (createMutation.error as AxiosError<any>)?.response?.data
                  ?.errors?.[0]?.message ??
                "Kunne ikke opprette prosjekt."}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddProjectAccordion;
