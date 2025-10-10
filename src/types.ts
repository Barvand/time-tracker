// src/types.ts
export type ProjectStatus = "active" | "completed" | "inactive";

export type Project = {
  id: number; // MySQL INT
  name: string;
  description: string | null;
  status: ProjectStatus; // keep lowercase in API/DB for consistency
  totalHours: number | null;
  startDate: string | null; // "YYYY-MM-DD"
  endDate: string | null; // replaces completionDate
};

export type ProjectId = {
  projectId: string;
};

export type CreateProjectInput = {
  name: string;
  description?: string;
  status: "active" | "inactive" | "completed" | "cancelled";
  startDate?: string;
  completionDate?: string;
};


export const ROLES = ["admin", "employee", "accountant"] as const;
export type Role = (typeof ROLES)[number];

export function isRole(x: string): x is Role {
  return (ROLES as readonly string[]).includes(x);
}
