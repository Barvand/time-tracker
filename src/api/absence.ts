import { makeRequest } from "../lib/axios";
import { useQuery } from "@tanstack/react-query";

export type Absence = {
  id: number;
  name: string;
};

export function GetAbsenceData() {
  return useQuery<Absence[], Error>({
    queryKey: ["absence"],
    queryFn: async () => (await makeRequest.get("/absence")).data,
    staleTime: 60_000,
  });
}
