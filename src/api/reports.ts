import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../lib/axios";
import type { HourRow } from "./hours";

/** Detail row for a project */
export type ProjectHourRow = {
  idHours: number;
  userId: number;
  name: string;
  projectId: number;
  projectName: string;
  startTime: string;
  endTime: string;
  breakMinutes: number;
  hoursWorked: number | string; // coerce later
  note?: string | null;
};

/** Summary row grouped by user for a project */
export type ProjectUserSummary = {
  userId: number;
  name: string;
  totalHours: number | string; // coerce later
};

type RangeParams = { from?: string; to?: string; userId?: string | number };

export async function fetchProjectHours(projectId: string | number) {
  const { data } = await makeRequest.get(
    `/reports/projects/${projectId}/hours`,
  );
  return data as ProjectHourRow[];
}

export async function fetchProjectHoursByUser(
  projectId: string | number,
  params: RangeParams = {},
) {
  const { data } = await makeRequest.get(
    `/reports/projects/${projectId}/hours/by-user`,
    { params },
  );
  return data as ProjectUserSummary[];
}

export function GetProjectHours(projectId?: string | number) {
  return useQuery<ProjectHourRow[], Error>({
    queryKey: ["reports", "project-hours", projectId],
    enabled: !!projectId,
    queryFn: () => fetchProjectHours(projectId!),
    staleTime: 60_000,
  });
}

export function GetProjectHoursByUser(projectId?: string | number) {
  return useQuery<ProjectUserSummary[], Error>({
    queryKey: ["reports", "project-hours-by-user", projectId],
    enabled: !!projectId,
    queryFn: () => fetchProjectHoursByUser(projectId!),
    staleTime: 60_000,
  });
}

export type AbsenceHourRow = {
  idHours: number;
  userId: number;
  name: string;
  absenceId: number;
  absenceName?: string;
  absenceCode?: string | number;
  startTime: string;
  endTime: string;
  breakMinutes: number;
  hoursWorked: number;
  note?: string | null;
};

export async function fetchAbsenceHoursByUser(absenceId: string | number) {
  const { data } = await makeRequest.get(
    `/reports/absence/${absenceId}/hours-by-user`,
  );
  return data as ProjectUserSummary[];
}

export function GetAbsenceHoursByUser(absenceId?: string | number) {
  return useQuery<ProjectUserSummary[], Error>({
    queryKey: ["reports", "absence", absenceId, "hours-by-user"],
    enabled: !!absenceId,
    queryFn: () => fetchAbsenceHoursByUser(absenceId!),
    staleTime: 60_000,
  });
}

export async function fetchAbsenceHours(absenceId: string | number) {
  const { data } = await makeRequest.get(`/reports/absence/${absenceId}/hours`);
  return data as HourRow[];
}

export function GetAbsenceHours(absenceId?: string | number) {
  return useQuery<HourRow[], Error>({
    queryKey: ["reports", "absence", absenceId, "hours"],
    enabled: !!absenceId,
    queryFn: () => fetchAbsenceHours(absenceId!),
    staleTime: 60_000,
  });
}
