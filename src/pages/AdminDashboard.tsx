import { useEffect, useState } from "react";
import ProjectItem from "../components/projects/ProjectItem";
import { useCreateProject, GetProjects } from "../api/projects";
import RefetchDataBtn from "../components/admin/refetchDataBtn";
import FilterTabs from "../components/admin/FilterTabs";
import SearchBar from "../components/admin/searchBar";
import AddProjectAccordion from "../components/admin/AddProjectAccordion";
import RegisterBtn from "../components/admin/RegisterAccountBtn";
import InfoBanner from "../utils/InfoBanner";
import {
  TAB_CONFIG,
  type ProjectTab,
  filterProjects,
} from "../features/projects/projectFilters";
import type { ProjectFormData } from "../types";
import { GetAbsenceData } from "../api/absence";
import AbsenceItem from "../components/projects/AbsenceItem";

const initialFormData: ProjectFormData = {
  name: "",
  description: "",
  status: "inactive",
  startDate: "",
  completionDate: "",
  projectCode: "",
};

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<ProjectTab>("active");
  const [search, setSearch] = useState("");
  const [showAddProject, setShowAddProject] = useState(false);
  const [mode, setMode] = useState<"projects" | "absence">("projects");
  const { data: projects = [], isLoading, error, refetch } = GetProjects();
  const { data: absence = [] } = GetAbsenceData();
  const displayedProjects = filterProjects(projects, activeTab, search);

  const [formData, setFormData] = useState<ProjectFormData>(initialFormData);

  const createMutation = useCreateProject();

  // ✅ Reset form + close accordion after successful create
  useEffect(() => {
    if (createMutation.isSuccess) {
      setFormData(initialFormData);
      setShowAddProject(false);

      // Prevent "sticky success" from retriggering on next renders
      createMutation.reset();
    }
  }, [createMutation.isSuccess, createMutation]);

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold">Adminstrator</h1>
      <InfoBanner string="Her kan du opprette prosjekter og brukerkontoer for dine ansatte." />

      <RefetchDataBtn refetch={refetch} isLoading={isLoading} />
      <RegisterBtn />
      <SearchBar search={search} setSearch={setSearch} />

      <FilterTabs
        projects={projects}
        absence={absence}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        mode={mode}
        setMode={setMode}
        TAB_CONFIG={TAB_CONFIG}
      />

      <AddProjectAccordion
        showAddProject={showAddProject}
        setShowAddProject={setShowAddProject}
        setFormData={setFormData}
        formData={formData}
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
          <div className="bg-red-200 border border-red-500 p-3 rounded mt-4">
            <p className="text-red-700">
              Something went wrong, please try again
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
