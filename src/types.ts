export type Project = {
  projectCode: string;
  id: number; // MySQL INT
  name: string;
  description: string | null;
  status: ProjectStatus;
  totalHours: number | null;
  startDate: string | null; // "YYYY-MM-DD"
  endDate: string | null; // replaces completionDate
};

export type ProjectId = {
  projectId: string;
};

export const ROLES = ["admin", "employee", "accountant"] as const;
export type Role = (typeof ROLES)[number];

export function isRole(x: string): x is Role {
  return (ROLES as readonly string[]).includes(x);
}

export type ProjectStatus = "active" | "completed" | "inactive";

export type ProjectFormData = {
  name: string;
  description: string;
  status: ProjectStatus;
  startDate: string;
  completionDate: string;
  projectCode: string;
};
