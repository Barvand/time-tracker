// src/components/employee/form/ProjectForm.tsx
import type { Project } from "../../../types";
import SelectField from "../../form/SelectField";

const fraværOptions = [
  { value: "101", label: "Sykedag" },
  { value: "102", label: "Omsorgsdag" },
  { value: "103", label: "Ferie" },
  { value: "104", label: "Permisjon" },
  { value: "105", label: "Møte" },
  { value: "106", label: "Kurs" },
];

type ProjectFormProps = {
  projects: Project[];
  projectsLoading?: boolean;
  projectsError?: unknown;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  projectId: string;
  absenceId: string;
};

export default function ProjectForm({
  projectsLoading,
  projectsError,
  projects,
  projectId,
  absenceId,
  onChange,
}: ProjectFormProps) {
  return (
    <section className="grid gap-3 mt-6 rounded-lg my-5">
      <h3 className="text-2xl font-semibold">Hva har du jobbet med i dag?</h3>
      <p className="mt-1 text-sm text-red-600 font-bold">
        NB: Du kan kun velge enten prosjekt eller fravær.
      </p>

      <div className="flex flex-col gap-2 justify-evenly w-full md:flex-row">
        {projectsLoading ? (
          <p className="mt-2 text-sm">Loading projects…</p>
        ) : projectsError ? (
          <p className="mt-2 text-sm text-red-600">Failed to load projects</p>
        ) : (
          <SelectField
            name="projectId"
            value={projectId}
            onChange={onChange}
            placeholder="Velg et prosjekt"
            label="Velg et prosjekt"
            options={projects.map((p) => ({
              value: String(p.id),
              label: p.name,
            }))}
          />
        )}

        <SelectField
          name="absenceId"
          value={absenceId}
          onChange={onChange}
          label="Velg fravær"
          placeholder="Velg et fravær"
          options={fraværOptions}
        />
      </div>
    </section>
  );
}
