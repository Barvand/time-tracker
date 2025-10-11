type TabConfigItem = {
  label: string;
  filter: (project: any) => boolean; // TODO: replace any
  active?: boolean;
};

type FilterTabsProps = {
  projects: any[];                   // TODO: replace any
  activeTab: string;
  setActiveTab: React.Dispatch<React.SetStateAction<any>>;
  TAB_CONFIG: Record<string, TabConfigItem>;
};

function FilterTabs({
  projects,
  activeTab,
  setActiveTab,
  TAB_CONFIG,
}: FilterTabsProps) {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex mb-4 space-x-4">
        {Object.entries(TAB_CONFIG).map(([key, cfg]) => {
          const count = projects.filter(cfg.filter).length;
          return (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`px-4 py-2 rounded ${
                activeTab === key ? "bg-blue-600 text-white" : "bg-gray-200"
              }`}
            >
              {cfg.label} ({count})
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default FilterTabs;
