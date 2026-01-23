"use client";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadProjectImage } from "../../api/upload";

function ImageInput({ projectCode }: { projectCode: string }) {
  const [file, setFile] = useState<File | null>(null);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: uploadProjectImage,
    onSuccess: () => {
      // 🔥 refresh gallery
      queryClient.invalidateQueries({
        queryKey: ["project-images", projectCode],
      });
      setFile(null);
    },
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) setFile(selected);
  };

  const handleUpload = () => {
    if (!file) return;

    mutation.mutate({
      projectCode,
      file,
    });
  };

  return (
    <div className="flex items-center gap-3">
      <input type="file" accept="image/*" onChange={handleFileSelect} />

      <button
        onClick={handleUpload}
        disabled={!file || mutation.isPending}
        className="px-4 py-2 bg-black text-white rounded disabled:opacity-50"
      >
        {mutation.isPending ? "Uploading…" : "Upload image"}
      </button>

      {mutation.isError && (
        <p className="text-red-500 text-sm">Upload failed</p>
      )}
    </div>
  );
}

export default ImageInput;
