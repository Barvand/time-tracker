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
      <h2 className="text-lg font-semibold color-primary mb-2">
        Vis prosjekter
      </h2>
      <div className="flex mb-6 gap-2 flex-wrap">
        <h2 className="sr-only">Filter tabs</h2>
        {Object.entries(TAB_CONFIG).map(([key, cfg]) => {
          const count = projects.filter(cfg.filter).length;

          return (
            <button
              role="tab"
              aria-selected={mode === "projects" && activeTab === key}
              key={key}
              onClick={() => {
                setMode("projects");
                setActiveTab(key as ProjectTab);
              }}
              className={`px-4 py-2 border-b-2 transition mb-2 ${
                mode === "projects" && activeTab === key
                  ? "border-blue-600 text-blue-600 font-medium"
                  : "border-transparent text-gray-600 hover:text-blue-500"
              }`}
            >
              {cfg.label} ({count})
            </button>
          );
        })}

        <div className="w-px bg-gray-300 mx-2" />

        {/* Fravær button in SAME ROW */}
        <button
          role="tab"
          aria-selected={mode === "absence"}
          onClick={() => setMode("absence")}
          className={`px-4 py-2 border-b-2 transition mb-2 ${
            mode === "absence"
              ? "border-green-600 text-green-600 font-medium"
              : "border-transparent text-gray-600 hover:text-green-600"
          }`}
        >
          Fravær ({absence.length})
        </button>
      </div>
    </div>
  );
}

export default FilterTabs;
