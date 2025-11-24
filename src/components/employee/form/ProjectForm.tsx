import type { Project } from "../../../types";
import SelectField from "../../form/SelectField";

type ProjectFormProps = {
  projects: Project[];
  projectsLoading?: boolean;
  projectsError?: unknown;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  projectId: string;
};

// ProjectForm component for the hour selection within the employee dashboard.
function ProjectForm({
  projectsLoading,
  projectsError,
  projects,
  projectId,
  onChange,
}: ProjectFormProps) {
  return (
    <section className="grid grid-rows-3 mt-6 rounded-lg p-6">
      <h3 className="text-2xl font-semibold">
        What project are you working on?
      </h3>
      <p className="mt-1 text-sm">Select a dropdown from the menu.</p>

      {projectsLoading ? (
        <p className="mt-2 text-sm">Loading projects…</p>
      ) : projectsError ? (
        <p className="mt-2 text-sm text-red-600">Failed to load projects</p>
      ) : (
        <SelectField
          name="projectId"
          value={projectId}
          onChange={onChange}
          label="Select project"
          options={projects.map((p) => ({
            value: String(p.id),
            label: p.name,
          }))}
        />
      )}
    </section>
  );
}

export default ProjectForm;
