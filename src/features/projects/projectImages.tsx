import ImageGallery from "./imageGallery";
import { fetchProjectImages } from "../../api/projects";
import { useQuery } from "@tanstack/react-query";

type GalleryImage = {
  id: string; 
  url: string;
  alt?: string;
};

export default function ProjectImages({
  projectCode,
}: {
  projectCode: string;
}) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["project-images", projectCode],
    queryFn: () => fetchProjectImages(projectCode),
  });

  if (isLoading) {
    return <p className="text-gray-400">Loading images…</p>;
  }

  if (isError) {
    return <p className="text-red-400">Failed to load images</p>;
  }

  const images: GalleryImage[] = data.map((img: any) => ({
    id: img.id,
    url: img.url,
    alt: img.filename,
  }));

  return <ImageGallery images={images} projectCode={projectCode} />;
}
