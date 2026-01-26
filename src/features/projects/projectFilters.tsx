import type { Project } from "../../types";

export const TAB_CONFIG = {
  all: { label: "Alle prosjekter", filter: () => true },
  active: { label: "Aktive prosjekter", filter: (p: Project) => p.status === "active" },
  completed: {
    label: "Fullførte prosjekter",
    filter: (p: Project) => p.status === "completed",
  },
  inactive: {
    label: "Inaktive prosjekter",
    filter: (p: Project) => p.status === "inactive",
  },
} as const;

export type ProjectTab = keyof typeof TAB_CONFIG;

export function filterProjects(
  projects: Project[],
  tab: ProjectTab,
  search: string,
) {
  const q = search.trim().toLowerCase();

  return projects.filter(TAB_CONFIG[tab].filter).filter((p) => {
    if (!q) return true;
    const searchableText = [p.name, p.description, p.projectCode]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    return searchableText.includes(q);
  });
}
