import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../lib/axios";

export type HourRow = {
  projectCode: string;
  absenceId: string;
  name: string;
  idHours: number;
  userId: number;
  projectsId: number;
  startTime: string; // ISO from server
  endTime: string; // ISO from server
  breakMinutes: number;
  hoursWorked: number; // computed on server
  note?: string;
};

export type CreateHourPayload = {
  userId: number;
  breakMinutes: number;
  note?: string;
  projectsId: string | null;
  absenceId: string | null;
  startTime: string | null;
  endTime: string | null;
};

export type UpdateHourData = Partial<{
  startTime: string;
  endTime: string;
  breakMinutes: number;
  projectsId: number;
  note: string;
}>;

export async function listHoursByUser(userId: string | number) {
  const { data } = await makeRequest.get("/hours", { params: { userId } });
  return data as HourRow[];
}

export function useAllUsersHours() {
  return useQuery({
    queryKey: ["hours", "all"],
    queryFn: async () => {
      const response = await makeRequest.get("/hours"); // Adjust endpoint as needed
      return response.data as HourRow[];
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useUserHours(userId?: string | number) {
  return useQuery<HourRow[], Error>({
    queryKey: ["hours", "user", userId],
    enabled: !!userId,
    queryFn: () => listHoursByUser(userId!),
    staleTime: 60_000,
  });
}

export function useCreateHour(userIdForCache?: string | number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateHourPayload) =>
      makeRequest.post("/hours", payload).then((r) => r.data as HourRow),
    onSuccess: (created) => {
      qc.setQueryData(
        ["hours", "user", created.userId],
        (old: HourRow[] = []) => [created, ...old],
      );
      if (userIdForCache) {
        qc.invalidateQueries({ queryKey: ["hours", "user", userIdForCache] });
      }
    },
  });
}

export function useUpdateHour() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      idHours,
      data,
    }: {
      idHours: number | string;
      data: UpdateHourData;
    }) =>
      makeRequest.put(`/hours/${idHours}`, data).then((r) => r.data as HourRow),
    onSuccess: (updated) => {
      qc.setQueryData(
        ["hours", "user", updated.userId],
        (old: HourRow[] = []) =>
          old.map((r) => (r.idHours === updated.idHours ? updated : r)),
      );
      qc.invalidateQueries({ queryKey: ["hours", "user", updated.userId] });
    },
  });
}

export function useDeleteHour(userIdForCache?: string | number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ idHours }: { idHours: number | string }) =>
      makeRequest.delete(`/hours/${idHours}`),
    onSuccess: (_res, vars) => {
      if (userIdForCache) {
        qc.setQueryData(
          ["hours", "user", userIdForCache],
          (old: HourRow[] = []) =>
            old.filter((r) => r.idHours !== vars.idHours),
        );
        qc.invalidateQueries({ queryKey: ["hours", "user", userIdForCache] });
      }
    },
  });
}
