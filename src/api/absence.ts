import { makeRequest } from "../lib/axios";
import { useQuery } from "@tanstack/react-query";

export type Absence = {
  id: number;
  name: string;
  absenceCode?: string;
  description?: string;
  totalHours?: number | null;
  status?: "active" | "inactive";
};

export function GetAbsenceData() {
  return useQuery<Absence[], Error>({
    queryKey: ["absence"],
    queryFn: async () => (await makeRequest.get("/absence")).data,
    staleTime: 60_000,
  });
}

export function GetAbsenceById(absenceId: any) {
  return useQuery<Absence, Error>({
    queryKey: ["absence", absenceId],
    queryFn: async () => {
      const response = await makeRequest.get(`/absence/${absenceId}`);
      return response.data;
    },
    enabled: !!absenceId, // prevents query from running if absenceId is undefined/null
    staleTime: 60_000, // 1 minute
  });
}

export function GetAbsenceByCode(absenceCode?: string | number) {
  return useQuery<Absence, Error>({
    queryKey: ["absence", "code", absenceCode],
    enabled:
      absenceCode !== undefined &&
      absenceCode !== null &&
      String(absenceCode) !== "",
    queryFn: async () => {
      const res = await makeRequest.get(`/absence/${absenceCode}`);
      return res.data;
    },
    staleTime: 60_000,
  });
}
