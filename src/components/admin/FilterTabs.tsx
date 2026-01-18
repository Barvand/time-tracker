import type { Absence } from "../../api/absence";
import type { ProjectTab } from "../../features/projects/projectFilters";
import type { Project } from "../../types";

type TabConfigItem = {
  label: string;
  filter: (project: Project) => boolean;
};

type FilterTabsProps = {
  projects: Project[];
  absence: Absence[];
  activeTab: ProjectTab;
  setActiveTab: React.Dispatch<React.SetStateAction<ProjectTab>>;
  mode: "projects" | "absence";
  setMode: React.Dispatch<React.SetStateAction<"projects" | "absence">>;
  TAB_CONFIG: Record<ProjectTab, TabConfigItem>;
};

function FilterTabs({
  projects,
  absence,
  activeTab,
  setActiveTab,
  mode,
  setMode,
  TAB_CONFIG,
}: FilterTabsProps) {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex mb-4 space-x-4 flex-wrap">
        {Object.entries(TAB_CONFIG).map(([key, cfg]) => {
          const count = projects.filter(cfg.filter).length;

          return (
            <button
              key={key}
              onClick={() => {
                setMode("projects");
                setActiveTab(key as ProjectTab);
              }}
              className={`px-4 py-2 rounded ${
                mode === "projects" && activeTab === key
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200"
              }`}
            >
              {cfg.label} ({count})
            </button>
          );
        })}

        {/* Fravær button in SAME ROW */}
        <button
          onClick={() => setMode("absence")}
          className={`px-4 py-2 rounded ${
            mode === "absence" ? "bg-red-600 text-white" : "bg-gray-200"
          }`}
        >
          Fravær ({absence.length})
        </button>
      </div>
    </div>
  );
}

export default FilterTabs;
