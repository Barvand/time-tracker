// src/components/ProjectSelect.tsx
import type { Project } from "../../types";

type Props = {
  projects: Project[];
  value: string;
  onChange: (val: string) => void;
  isLoading?: boolean;
  error?: unknown;
};

export default function ProjectSelect({
  projects,
  value,
  onChange,
  isLoading,
  error,
}: Props) {
  if (isLoading) return <p className="mt-2 text-sm">Loading projects…</p>;
  if (error)
    return <p className="mt-2 text-sm text-red-600">Failed to load projects</p>;
  return (
    <select
      name="projectId"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="mt-3 w-full rounded border bg-white p-3"
    >
      <option value="">Select…</option>
      {projects.map((p) => (
        <option key={p.id} value={p.id}>
          {p.name}
        </option>
      ))}
    </select>
  );
}
