import type { Project } from "../../../../types";
import SelectField from "../../../form/SelectField";

type ProjectFormProps = {
  projects: Project[];
  projectsLoading?: boolean;
  projectsError?: unknown;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  projectId: string | undefined;
};

export default function ProjectSelectInput({
  projectsLoading,
  projectsError,
  projects,
  projectId,
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
          <>
            <SelectField
              name="projectId"
              value={projectId || ""}
              onChange={onChange}
              label="Velg et prosjekt"
              placeholder="Velg prosjekt"
              options={projects
                .sort((a, b) => {
                  // Sort by projectCode descending (highest first)
                  const codeA = a.projectCode ? parseInt(a.projectCode, 10) : 0;
                  const codeB = b.projectCode ? parseInt(b.projectCode, 10) : 0;
                  return codeB - codeA; // Descending order
                })
                .map((p) => ({
                  value: String(p.id),
                  label: p.projectCode
                    ? `${p.projectCode} - ${p.name}`
                    : p.name,
                }))}
            />
          </>
        )}
      </div>
    </section>
  );
}
