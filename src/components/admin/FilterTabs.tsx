function FilterTabs({ projects, activeTab, setActiveTab, TAB_CONFIG }) {
  // ---- filter by tab + search

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      {/* Tabs */}
      <div className="flex mb-4 space-x-4">
        {(
          Object.entries(TAB_CONFIG) as Array<
            [keyof typeof TAB_CONFIG, (typeof TAB_CONFIG)["active"]]
          >
        ).map(([key, cfg]) => {
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
