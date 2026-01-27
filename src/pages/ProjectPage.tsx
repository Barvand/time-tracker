import ReportPerProject from "../components/ProjectDetailsPage/HourDetailsProjectPage";
import { useEffect, useState, useMemo } from "react";
import ProjectDetails from "../components/ProjectDetailsPage/ProjectDetails";
import ProjectImagesPage from "../components/ProjectDetailsPage/ProjectImagesPage";
import { useAuth } from "../features/auth/useAuth";

function ProjectPage() {
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState<string>(() => {
    return localStorage.getItem("projectPageActiveTab") || "info";
  });

  const tabs = useMemo(
    () => [
      {
        key: "info",
        label: "Informasjon om prosjekt",
        component: <ProjectDetails />,
      },

      ...(user?.role === "admin"
        ? [
            {
              key: "report",
              label: "Rapport per ansatt",
              component: <ReportPerProject />,
            },
          ]
        : []),

      {
        key: "images",
        label: "Bilder av prosjekt",
        component: <ProjectImagesPage />,
      },
    ],
    [user?.role],
  );

  // Ensure active tab is valid (important if role changes)
  useEffect(() => {
    const exists = tabs.find((tab) => tab.key === activeTab);

    if (!exists) {
      setActiveTab("info");
    }
  }, [tabs, activeTab]);

  // Save active tab
  useEffect(() => {
    localStorage.setItem("projectPageActiveTab", activeTab);
  }, [activeTab]);

  const activeComponent = tabs.find((tab) => tab.key === activeTab)?.component;

  return (
    <div>
      {/* Tabs */}
      <div className="flex justify-start gap-5 border-r max-w-6xl mx-auto px-4 py-2">
        <div className="tabs flex gap-3">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 cursor-pointer border border-b-4 border-gray-900 ${
                activeTab === tab.key
                  ? "border-b-4 border-[#2c3e50] bg-[#2c3e50] font-semibold text-white cursor-pointer"
                  : "text-gray-600"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="mt-4 max-w-6xl mx-auto">{activeComponent}</div>
    </div>
  );
}

export default ProjectPage;
