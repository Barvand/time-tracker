import { useState } from "react";
import ProjectItem from "../components/projects/ProjectItem";
import { useQuery, useMutation } from "@tanstack/react-query";
import type { Project } from "../types";
import { makeRequest } from "../lib/axios";
import RefetchDataBtn from "../components/admin/refetchDataBtn";
import FilterTabs from "../components/admin/FilterTabs";
import SearchBar from "../components/admin/searchBar";
import AddProjectAccordion from "../components/admin/AddProjectAccordion";
import { useAuth } from "../features/auth/useAuth";
import RegisterBtn from "../components/admin/RegisterAccountBtn";

const TAB_CONFIG = {
  all: { label: "Alle", filter: () => true },
  active: { label: "Aktive", filter: (p: Project) => p.status === "active" },
  completed: {
    label: "Fullførte",
    filter: (p: Project) => p.status === "completed",
  },
  inactive: {
    label: "Inaktive",
    filter: (p: Project) => p.status === "inactive",
  },
} as const;

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<
    "active" | "completed" | "inactive" | "Alle"
  >("active");
  const [search, setSearch] = useState("");
  const [showAddProject, setShowAddProject] = useState(false);

  // ---- FETCH: GET /api/projects
  const {
    data: projects = [],
    isLoading,
    error,
    refetch,
  } = useQuery<Project[]>({
    queryKey: ["projects"],
    queryFn: async () => {
      const { data } = await makeRequest.get("/projects");
      return data;
    },
  });

  // ---- filter by tab + search
  const displayedProjects = projects
    .filter(TAB_CONFIG[activeTab].filter)
    .filter((p) => {
      const q = search.trim().toLowerCase();
      if (!q) return true;
      return (
        p.name.toLowerCase().includes(q) ||
        (p.description || "").toLowerCase().includes(q)
      );
    });

  // ---- local form state
  const [formData, setFormData] = useState<any>({
    name: "",
    description: "",
    status: "active",
    startDate: "",
    completionDate: "",
    projectCode: "",
  });

  const { user } = useAuth();

  // ---- CREATE: POST /api/projects (+ optional log)
  const createMutation = useMutation({
    mutationFn: async (payload: any) => {
      const {
        name,
        description,
        status,
        startDate,
        completionDate,
        projectCode,
      } = payload;

      const { data: created } = await makeRequest.post("/projects", {
        name,
        description,
        status,
        startDate: startDate || null,
        endDate: completionDate || null,
        projectCode,
      });
      try {
        if (user?.userId) {
          await makeRequest.post(`/projects/${created.projectCode}/entries`, {
            action: "created",
            userId: user.userId,
            userName: user.username,
            note: `Prosjekt opprettet av ${user.username}`,
            timestamp: new Date().toISOString(),
          });
        }
      } catch (e) {
        console.log("Could not write project log", e);
      }

      return created;
    },
    onSuccess: () => {
      setFormData({
        name: "",
        description: "",
        status: "active",
        startDate: "",
        completionDate: "",
        projectCode: "",
      });
      setShowAddProject(false);
      refetch();
    },
  });

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <RefetchDataBtn refetch={refetch} isLoading={isLoading} />
      <RegisterBtn />
      <SearchBar search={search} setSearch={setSearch} />

      {/* Tabs */}
      <FilterTabs
        projects={projects}
        setActiveTab={setActiveTab}
        TAB_CONFIG={TAB_CONFIG}
        activeTab={activeTab}
      />

      <AddProjectAccordion
        showAddProject={showAddProject}
        setShowAddProject={setShowAddProject}
        setFormData={setFormData}
        formData={formData}
        createMutation={createMutation}
      />

      {/* List */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">
            {TAB_CONFIG[activeTab].label}
          </h2>
          <span className="text-sm text-gray-500">
            {displayedProjects.length} prosjekt
            {displayedProjects.length !== 1 ? "er" : ""}
          </span>
        </div>

        {isLoading ? (
          <div className="text-center py-8">
            <p className="text-gray-600">Laster prosjekter...</p>
          </div>
        ) : displayedProjects.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">
              {search
                ? "Ingen prosjekter funnet som matcher søket."
                : "Ingen prosjekter funnet."}
            </p>
            {search && (
              <button
                onClick={() => setSearch("")}
                className="text-blue-600 hover:underline text-sm mt-2"
              >
                Fjern søkefilter
              </button>
            )}
          </div>
        ) : (
          <ul className="space-y-2">
            {displayedProjects.map((p) => (
              <ProjectItem key={p.id} project={p} />
            ))}
          </ul>
        )}
        {error && (
          <div className="bg-red-200 border border-red-500">
            <p className="bg-red-700">Something went wrong, please try again</p>
          </div>
        )}
      </div>
    </div>
  );
}
