import { useEffect, useMemo, useState } from "react";
import ProjectItem from "../components/projects/ProjectItem";
import { useCreateProject, GetProjects } from "../api/projects";
import FilterTabs from "../components/admin/FilterTabs";
import SearchBar from "../components/admin/searchBar";

import RegisterBtn from "../components/UI/buttons/RegisterAccountBtn";
import {
  TAB_CONFIG,
  type ProjectTab,
  filterProjects,
} from "../features/projects/projectFilters";
import type { ProjectFormData } from "../types";
import { GetAbsenceData } from "../api/absence";
import AbsenceItem from "../components/projects/AbsenceItem";
import ErrorMessage from "../components/UI/UX-messages/ErrorMessage";
import AttentionMessage from "../components/UI/UX-messages/AttentionMessage";
import AddProjectModal from "../components/admin/AddProjectModal";

const initialFormData: ProjectFormData = {
  name: "",
  description: "",
  status: "active",
  startDate: "",
  endDate: "",
  projectCode: "",
};

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<ProjectTab>("active");
  const [search, setSearch] = useState("");
  const [showAddProject, setShowAddProject] = useState(false);
  const [mode, setMode] = useState<"projects" | "absence">("projects");
  const { data: projects = [], isLoading, error } = GetProjects();
  const { data: absence = [] } = GetAbsenceData();
  const [formData, setFormData] = useState<ProjectFormData>(initialFormData);
  const createMutation = useCreateProject();
  const displayedProjects = useMemo(() => {
    return [...filterProjects(projects, activeTab, search)].sort(
      (a, b) => Number(b.projectCode) - Number(a.projectCode),
    );
  }, [projects, activeTab, search]);

  // ✅ Reset form + close accordion after successful create
  useEffect(() => {
    if (createMutation.isSuccess) {
      setFormData(initialFormData);
      setShowAddProject(false);
      createMutation.reset();
    }
  }, [createMutation.isSuccess, createMutation]);

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Adminstrator</h1>
      <AttentionMessage message="Her kan du opprette prosjekter og brukerkontoer for dine ansatte." />
      <h2 className="text-lg font-semibold mb-1">Hva vil du gjøre?</h2>

      <p className="text-sm text-gray-600 mb-3">
        Start med å opprette et prosjekt eller legge til ansatte.
      </p>

      <div className="bg-gray-50 p-4 mb-10 mt-10">
        <div className="flex gap-3 flex-wrap items-center">
          <button
            onClick={() => setShowAddProject(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded
                 hover:bg-blue-700 transition"
          >
            + Nytt prosjekt
          </button>

          <RegisterBtn />
        </div>
      </div>
      <FilterTabs
        projects={projects}
        absence={absence}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        mode={mode}
        setMode={setMode}
        TAB_CONFIG={TAB_CONFIG}
      />

      <SearchBar search={search} setSearch={setSearch} />

      <AddProjectModal
        open={showAddProject}
        onClose={() => setShowAddProject(false)}
        formData={formData}
        setFormData={setFormData}
        createMutation={createMutation}
      />

      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">
            {mode === "absence" ? "Fravær" : TAB_CONFIG[activeTab].label}
          </h2>

          <span className="text-sm text-gray-500">
            {mode === "absence"
              ? `${absence.length} fravær`
              : `${displayedProjects.length} prosjekt${displayedProjects.length !== 1 ? "er" : ""}`}
          </span>
        </div>

        {mode === "absence" ? (
          absence.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">Ingen fravær registrert.</p>
            </div>
          ) : (
            <ul className="space-y-2">
              {absence.map((a) => (
                <AbsenceItem key={a.id} absence={a} />
              ))}
            </ul>
          )
        ) : isLoading ? (
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

        {error && mode !== "absence" && (
          <ErrorMessage
            onClose={createMutation.reset}
            message="Noe gikk galt ved henting av prosjekter. Vennligst prøv igjen senere."
          />
        )}
      </div>
    </div>
  );
}
