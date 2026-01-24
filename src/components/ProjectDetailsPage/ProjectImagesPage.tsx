import ImageInput from "./ImageInput";
import ProjectImages from "../../features/projects/projectImages";
import { useParams } from "react-router-dom";

function ProjectImagesPage() {
  const { projectCode } = useParams<{ projectCode: any }>();

  return (
    <div className="max-w-6xl mx-auto">
      <ImageInput projectCode={projectCode} />
      <ProjectImages projectCode={projectCode} />
    </div>
  );
}

export default ProjectImagesPage;
