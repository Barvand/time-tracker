import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../lib/axios";

/** Detail row for a project */
export type ProjectHourRow = {
  idHours: number;
  userId: number;
  userName: string;
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
  userName: string;
  totalHours: number | string; // coerce later
};

type RangeParams = { from?: string; to?: string; userId?: string | number };

export async function fetchProjectHours(projectId: string | number) {
  const { data } = await makeRequest.get(
    `/reports/projects/${projectId}/hours`
  );
  console.log(data);
  return data as ProjectHourRow[];
}

export async function fetchProjectHoursByUser(
  projectId: string | number,
  params: RangeParams = {}
) {
  const { data } = await makeRequest.get(
    `/reports/projects/${projectId}/hours/by-user`,
    { params }
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
