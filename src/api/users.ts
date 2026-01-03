import { makeRequest } from "../lib/axios";
import { useQuery } from "@tanstack/react-query";

export function GetUsers() {
  return useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await makeRequest.get("/users");
      return response.data as Array<{ userId: number; name: string }>;
    },
  });
}
