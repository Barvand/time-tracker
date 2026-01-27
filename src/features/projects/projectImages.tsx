import ImageGallery from "./imageGallery";
import { fetchProjectImages } from "../../api/projects";
import { useQuery } from "@tanstack/react-query";
import type { GalleryImage } from "../../types";
import { useAuth } from "../auth/useAuth";

export default function ProjectImages({
  projectCode,
}: {
  projectCode: string;
}) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["project-images", projectCode],
    queryFn: () => fetchProjectImages(projectCode),
  });

  const { user } = useAuth();
  const currentUserId = user?.userId;

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
    uploadedBy: img.uploadedBy,
  }));

  return (
    <ImageGallery
      images={images}
      projectCode={projectCode}
      currentUserId={currentUserId ?? 0}
      isAdmin={user?.role === "admin"}
    />
  );
}
