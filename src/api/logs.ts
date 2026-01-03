import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../lib/axios";

/** Server row (from /hours) */
type HourRow = {
  idHours: number;
  userId: number;
  projectsId: number;
  startTime: string; // ISO
  endTime: string; // ISO
  breakMinutes: number; // camelCase on your server
  hoursWorked: number; // computed on server
  note?: string | null;
};

/** Frontend shape expected by the old "entries" UI */
export type Log = {
  id: number; // maps from idHours
  userId: number;
  projectId: number; // maps from projectsId
  timestamp: string; // ISO at 00:00Z for the workday
  startTime: string; // "HH:mm"
  endTime: string; // "HH:mm"
  breakMinutes: number;
  hoursAdded: number; // maps from hoursWorked
  note?: string;
};

export type UpdateLogData = {
  /** REQUIRED if you change startTime or endTime (to know which date) */
  timestamp?: string; // ISO date (00:00Z)
  startTime?: string; // "HH:mm"
  endTime?: string; // "HH:mm"
  breakMinutes?: number;
  note?: string;
};

/* -------------------- helpers -------------------- */

function toHHMM(iso: string) {
  const d = new Date(iso);
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
}

/** Midnight UTC for the date in the given ISO datetime */
function startOfDayUTC(iso: string) {
  const d = new Date(iso);
  const y = d.getUTCFullYear();
  const m = d.getUTCMonth();
  const day = d.getUTCDate();
  return new Date(Date.UTC(y, m, day)).toISOString();
}

/** Build ISO from a date ("YYYY-MM-DD" or ISO) + "HH:mm" time (UTC) */
function combineDateAndTime(dateISOorYMD: string, hhmm: string) {
  // Accept "YYYY-MM-DD" or full ISO at 00:00:00Z
  const date = dateISOorYMD.includes("T")
    ? new Date(dateISOorYMD)
    : new Date(
        Date.UTC(
          Number(dateISOorYMD.slice(0, 4)),
          Number(dateISOorYMD.slice(5, 7)) - 1,
          Number(dateISOorYMD.slice(8, 10))
        )
      );
  const [h, m] = hhmm.split(":").map(Number);
  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), h, m)
  ).toISOString();
}

function normalize(row: HourRow): Log {
  return {
    id: row.idHours,
    userId: row.userId,
    projectId: row.projectsId,
    timestamp: startOfDayUTC(row.startTime),
    startTime: toHHMM(row.startTime),
    endTime: toHHMM(row.endTime),
    breakMinutes: Number(row.breakMinutes ?? 0),
    hoursAdded: Number(row.hoursWorked ?? 0),
    note: row.note ?? undefined,
  };
}

/* -------------------- API calls -------------------- */

export async function listentriesByUser(
  userId: number | string
): Promise<Log[]> {
  const { data } = await makeRequest.get("/hours", { params: { userId } });
  return (data as HourRow[]).map(normalize);
}

export async function updateLog(
  logId: number | string,
  payload: UpdateLogData
): Promise<Log> {
  const patch: any = {};
  if (payload.breakMinutes !== undefined)
    patch.breakMinutes = payload.breakMinutes;
  if (payload.note !== undefined) patch.note = payload.note;

  // If times change, we need the date (timestamp) to build full ISO values
  if (payload.startTime) {
    if (!payload.timestamp)
      throw new Error("timestamp is required when updating startTime");
    patch.startTime = combineDateAndTime(payload.timestamp, payload.startTime);
  }
  if (payload.endTime) {
    if (!payload.timestamp)
      throw new Error("timestamp is required when updating endTime");
    patch.endTime = combineDateAndTime(payload.timestamp, payload.endTime);
  }

  const { data } = await makeRequest.patch(`/hours/${logId}`, patch);
  return normalize(data as HourRow);
}

export async function deleteLog(
  logId: number | string
): Promise<{ logId: number | string }> {
  await makeRequest.delete(`/hours/${logId}`);
  return { logId };
}

/* -------------------- React Query hooks -------------------- */

export function useUserentries(userId?: number | string) {
  return useQuery<Log[], Error>({
    queryKey: ["entries", "user", userId],
    enabled: !!userId,
    queryFn: () => listentriesByUser(userId!),
    staleTime: 60_000,
  });
}

export function useUpdateLog() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      logId,
      data,
    }: {
      logId: number | string;
      data: UpdateLogData;
    }) => updateLog(logId, data),
    onSuccess: (updated) => {
      qc.setQueryData(["entries", "user", updated.userId], (old: Log[] = []) =>
        old.map((l) => (l.id === updated.id ? updated : l))
      );
      qc.invalidateQueries({ queryKey: ["entries", "user", updated.userId] });
    },
  });
}

export function useDeleteLog(userId?: number | string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ logId }: { logId: number | string }) => deleteLog(logId),
    onSuccess: ({ logId }) => {
      if (userId) {
        qc.setQueryData(["entries", "user", userId], (old: Log[] = []) =>
          old.filter((l) => l.id !== Number(logId))
        );
        qc.invalidateQueries({ queryKey: ["entries", "user", userId] });
      } else {
        qc.invalidateQueries({ queryKey: ["entries"] });
      }
    },
  });
}
