import { useState, useEffect } from "react";
import Lightbox from "yet-another-react-lightbox";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteProjectImage } from "../../api/upload";
import ConfirmModal from "../../utils/ConfirmModal";

import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";

type GalleryImage = {
  id: number;
  url: string;
  alt?: string;
};

export default function ImageGallery({
  images,
  projectCode,
}: {
  images: GalleryImage[];
  projectCode: string;
}) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [loaded, setLoaded] = useState<Record<number, boolean>>({});
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [imageToDelete, setImageToDelete] = useState<number | null>(null);

  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
  mutationFn: deleteProjectImage,
  onSuccess: () => {
    queryClient.invalidateQueries({
      queryKey: ["project-images", projectCode],
    });
    setOpen(false);
  },
});


  const handleLoad = (id: number) => {
  setLoaded((prev) => ({
    ...prev,
    [id]: true,
  }));
};

  if (!images || images.length === 0) {
    return <p className="text-gray-400">No images available.</p>;
  }

  return (
    <div className="container mx-auto py-6 px-4">
      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {images.map((image, idx) => (
          <div
            key={image.id}
            className="relative aspect-[4/3] bg-gray-200 rounded-lg overflow-hidden cursor-pointer group"
            onClick={() => {
              setIndex(idx);
              setOpen(true);
            }}
          >
           {!loaded[image.id] && (
  <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 z-10" />
)}

<img
  src={image.url}
  alt={image.alt || "Gallery image"}
  className={`w-full h-full object-cover transition-opacity duration-300 ${
    loaded[image.id] ? "opacity-100" : "opacity-0"
  }`}
  onLoad={() => handleLoad(image.id)}
/>


            {/* ❌ Delete button */}
            <button
              disabled={deleteMutation.isPending}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setImageToDelete(image.id);
                setConfirmOpen(true);
              }}
              className="
                absolute top-2 right-2 z-20
                w-8 h-8 rounded-full
                bg-black/70 text-red-500
                flex items-center justify-center
                opacity-0 group-hover:opacity-100
                transition
                hover:bg-red-600 hover:text-white
              "
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      {/* Confirm Modal */}
      {confirmOpen && imageToDelete !== null && (
        <ConfirmModal
          title="Delete image"
          message="Are you sure you want to delete this image? This action cannot be undone."
          onCancel={() => {
            setConfirmOpen(false);
            setImageToDelete(null);
          }}
          onConfirm={() => {
            deleteMutation.mutate(imageToDelete);
            setConfirmOpen(false);
            setImageToDelete(null);
          }}
        />
      )}

      {/* Lightbox */}
      {open && (
        <Lightbox
          open={open}
          close={() => setOpen(false)}
          index={index}
          slides={images.map((img) => ({
            src: img.url,
            alt: img.alt,
          }))}
          on={{ view: ({ index }) => setIndex(index) }}
          plugins={[Thumbnails, Zoom]}
        />
      )}
    </div>
  );
}
