import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../lib/axios";
import type { Project } from "../types";
import type { ProjectFormData } from "../types";

export function GetProjects() {
  return useQuery<Project[], Error>({
    queryKey: ["projects"],
    queryFn: async () => (await makeRequest.get("/projects")).data,
    staleTime: 60_000,
  });
}

export function GetProjectById(projectId: any) {
  return useQuery<Project, Error>({
    queryKey: ["project", projectId],
    queryFn: async () => {
      const response = await makeRequest.get(`/projects/${projectId}`);
      return response.data;
    },
    enabled: !!projectId, // prevents query from running if projectId is undefined/null
    staleTime: 60_000, // 1 minute
  });
}

export type UpdateProjectInput = Partial<
  Pick<
    Project,
    "name" | "description" | "status" | "startDate" | "endDate" | "projectCode"
  >
>;

export function useUpdateProject() {
  const qc = useQueryClient();
  return useMutation({
    // payload: { id, data }
    mutationFn: async ({
      id,
      data,
    }: {
      id: string | number;
      data: UpdateProjectInput;
    }) => {
      const res = await makeRequest.put(`/projects/${id}`, data);
      return res.data as Project;
    },
    onSuccess: (updated) => {
      // keep single-project view fresh
      qc.setQueryData(["project", String(updated.id)], updated);
      // and refresh the projects list
      qc.invalidateQueries({ queryKey: ["projects"] });
    },
  });
}

export function useDeleteProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string | number) => {
      await makeRequest.delete(`/projects/${id}`);
      return id;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["projects"] });
    },
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: ProjectFormData) => {
      const { name, description, status, startDate, endDate, projectCode } =
        payload;

      const { data: created } = await makeRequest.post("/projects", {
        name,
        description,
        status,
        startDate: startDate || null,
        endDate: endDate || null,
        projectCode,
      });

      // // Implementing a creation log in the future perhaps? Need to make an endoint for it first.
      // if (user?.userId) {
      //   try {
      //     await makeRequest.post(`/projects/${projectCode}/entries`, {
      //       action: "created",
      //       userId: user.userId,
      //       name: user.name,
      //       note: `Prosjekt opprettet av ${user.name}`,
      //       timestamp: new Date().toISOString(),
      //     });
      //   } catch (e) {
      //     console.log("Could not write project log", e);
      //   }
      // }

      return created;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
}

export const fetchProjectImages = async (projectCode: string) => {
  const res = await makeRequest.get(`/projects/${projectCode}/images`);
  return res.data;
};
