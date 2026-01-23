import ReportPerProject from "../components/ProjectDetailsPage/HourDetailsProjectPage";
import { useState } from "react";
import ProjectDetails from "../components/ProjectDetailsPage/ProjectDetails";
import ProjectImagesPage from "../components/ProjectDetailsPage/ProjectImagesPage";

function ProjectPage() {
  const [isActive, setisActive] = useState<string | null>(null);

  const tabs = [
    { id: "tab1", label: "Informasjon om prosjekt" },
    { id: "tab2", label: "Rapport per ansatt" },
    { id: "tab3", label: "Bilder av prosjekt" },
  ];

  const tabContent = {
    tab1: <ProjectDetails />,
    tab2: <ReportPerProject />,
    tab3: <ProjectImagesPage />,
  };
  return (
    <div>
      <div className="flex items-center gap-5 border-b-5 border-[#2c3e50]">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setisActive(tab.id)}
            className={`px-4 py-2 ${
              isActive === tab.id
                ? "bg-[#2c3e50] font-bold text-white"
                : "bg-gray-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="mt-4">
        {tabContent[isActive as keyof typeof tabContent] || tabContent.tab1}
      </div>
    </div>
  );
}

export default ProjectPage;
