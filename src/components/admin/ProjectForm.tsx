import type { ProjectFormData } from "../../types";
import React from "react";
interface Props {
  formData: ProjectFormData;
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => void;
  onSubmit: (e: React.FormEvent) => void;
  isEdit?: boolean;
}

const ProjectForm: React.FC<Props> = ({
  formData,
  onChange,
  onSubmit,
  isEdit,
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4 bg-gray-50 p-4 mb-6">
      <div className="mb-4">
        <h3 className="text-lg font-bold mb-4">
          {isEdit ? "REDIGER PROSJEKT" : "NYTT PROSJEKT"}
        </h3>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Project nr: *
        </label>
        <input
          name="projectCode"
          value={formData.projectCode}
          onChange={onChange}
          placeholder="Project Nr"
          required
          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Navn *
        </label>
        <input
          name="name"
          value={formData.name}
          onChange={onChange}
          placeholder="Prosjektnavn"
          required
          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Beskrivelse
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={onChange}
          placeholder="Beskriv prosjektet..."
          rows={3}
          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Status *
        </label>
        <select
          name="status"
          value={formData.status}
          onChange={onChange}
          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
        >
          <option value="active">Aktiv</option>
          <option value="inactive">Inaktiv</option>
          <option value="completed">Avsluttet</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Oppstart
          </label>
          <input
            name="startDate"
            type="date"
            value={formData.startDate || ""}
            onChange={onChange}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ferdigstilt
          </label>
          <input
            name="completionDate"
            type="date"
            value={formData.completionDate || ""}
            onChange={onChange}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div className="pt-4 flex justify-end">
        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded cursor-pointer transition-colors duration-200 font-medium uppercase tracking-wide"
        >
          {isEdit ? "OPPDATER" : "SUBMIT"}
        </button>
      </div>
    </form>
  );
};

export default ProjectForm;
