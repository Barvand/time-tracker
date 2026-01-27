export type Project = {
  id: number; // MySQL INT
  name: string;
  description: string | null;
  status: ProjectStatus;
  totalHours: number | null;
  startDate: string | null; // "YYYY-MM-DD"
  endDate: string | null; // replaces completionDate
  projectCode: string | null;
  absenceCode: string | null;
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
  endDate: string;
  projectCode: string;
};

export type hourReviewProps = {
  userId: string | number;
  weekOffset: number;
  projects: Array<{ id: number; name: string }>;
  absence: Array<{ id: number; name: string }>;
};

export type viewMode = "weekly" | "monthly";

// Hour Form Types

export type EmployeeAddHourFormValues = {
  projectId?: string;
  absenceId?: string;
  date: string;
  startTime: string;
  endTime: string;
  breakMinutes: number;
  note?: string;
};

export type EmployeeAddHourFormProps = {
  projects: Project[];
  projectsLoading?: boolean;
  projectsError?: unknown;
  submitting?: boolean;
  successMsg?: string | null;
  errorMsg?: string | null;
  resetMessages: () => void;
  onSubmit: (v: EmployeeAddHourFormValues) => void | Promise<void>;
};

export type GalleryImage = {
  id: number;
  url: string;
  alt?: string;
  uploadedBy: number;
  currentUserId: number;
  isAdmin?: boolean;
};
