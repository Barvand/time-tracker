"use client";
import { useState, useEffect } from "react";
import Lightbox from "yet-another-react-lightbox";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Zoom from "yet-another-react-lightbox/plugins/zoom";

import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";

type GalleryImage = {
  url: string;
  alt?: string;
};

const ImageGallery = ({ images }: { images: GalleryImage[] }) => {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [loaded, setLoaded] = useState<boolean[]>([]);

  useEffect(() => {
    setLoaded(Array(images.length).fill(false));
  }, [images]);

  const handleLoad = (idx: number) => {
    setLoaded((prev) => {
      const next = [...prev];
      next[idx] = true;
      return next;
    });
  };

  if (!images || images.length === 0) {
    return <p className="text-gray-400">No images available.</p>;
  }

  return (
    <div className="container mx-auto py-6 px-4">
      {/* Image grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {images.map((image, idx) => (
          <div
            key={idx}
            className="relative aspect-[4/3] bg-gray-200 rounded-lg overflow-hidden cursor-pointer"
            onClick={() => {
              setIndex(idx);
              setOpen(true);
            }}
          >
            {!loaded[idx] && (
              <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 z-10" />
            )}

            <img
              src={image.url}
              alt={image.alt || "Gallery image"}
              className={`w-full h-full object-cover transition-opacity duration-300 ${
                loaded[idx] ? "opacity-100" : "opacity-0"
              }`}
              onLoad={() => handleLoad(idx)}
            />
          </div>
        ))}
      </div>

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
          render={{
            slideHeader: () => (
              <div className="absolute top-4 left-4 text-white bg-black/50 px-4 py-2 rounded-md">
                {index + 1} / {images.length}
              </div>
            ),
          }}
        />
      )}
    </div>
  );
};

export default ImageGallery;
