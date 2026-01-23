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
  const [heroLoaded, setHeroLoaded] = useState(false);
  const [loadedThumbs, setLoadedThumbs] = useState<boolean[]>([]);

  // Sync thumbnails when images change
  useEffect(() => {
    setLoadedThumbs(Array(Math.max(images.length - 1, 0)).fill(false));
  }, [images]);

  useEffect(() => {
    const handleScroll = () => {
      if (open) setOpen(false);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [open]);

  const handleThumbLoad = (idx: number) => {
    setLoadedThumbs((prev) => {
      const updated = [...prev];
      updated[idx] = true;
      return updated;
    });
  };

  if (!images || images.length === 0) {
    return <p className="text-gray-400">No images available.</p>;
  }

  return (
    <div className="container mx-auto py-6 px-4">
      {/* Hero image */}
      <div className="relative mb-4 aspect-[16/10] bg-gray-200 rounded-lg overflow-hidden">
        {!heroLoaded && (
          <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 z-10" />
        )}

        <img
          src={images[0].url}
          alt={images[0].alt || "Project image"}
          className={`w-full h-full object-cover cursor-pointer transition-opacity duration-300 ${
            heroLoaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() => setHeroLoaded(true)}
          onClick={() => {
            setIndex(0);
            setOpen(true);
          }}
        />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="relative overflow-x-auto whitespace-nowrap scrollbar-custom">
          <div className="flex gap-2">
            {images.slice(1).map((image, idx) => (
              <div
                key={idx}
                className="relative flex-shrink-0 w-32 h-24 rounded-md bg-gray-200 overflow-hidden"
              >
                {!loadedThumbs[idx] && (
                  <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 z-10" />
                )}

                <img
                  src={image.url}
                  alt={image.alt || "Project image"}
                  className={`w-full h-full object-cover cursor-pointer transition-opacity duration-300 ${
                    loadedThumbs[idx] ? "opacity-100" : "opacity-0"
                  }`}
                  onLoad={() => handleThumbLoad(idx)}
                  onClick={() => {
                    setIndex(idx + 1);
                    setOpen(true);
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Lightbox */}
      {open && (
        <Lightbox
          open={open}
          close={() => setOpen(false)}
          slides={images.map((img) => ({
            src: img.url,
            alt: img.alt,
          }))}
          index={index}
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
