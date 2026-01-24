
import { useState, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadProjectImage } from "../../api/upload";

const MAX_SIZE_MB = 5;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

function ImageInput({ projectCode }: { projectCode: string }) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: uploadProjectImage,
    onSuccess: () => {
  queryClient.invalidateQueries({
    queryKey: ["project-images", projectCode],
  });
  clearAll();
},
  });

  const clearAll = () => {
  setFiles([]);
  setError(null);
  if (inputRef.current) {
    inputRef.current.value = "";
  }
};

const removeFile = (index: number) => {
  setFiles((prev) => prev.filter((_, i) => i !== index));
};

const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
  const selectedFiles = Array.from(e.target.files || []);
  const validFiles: File[] = [];

  for (const file of selectedFiles) {
    if (file.size > MAX_SIZE_BYTES) {
      setError(`"${file.name}" is larger than ${MAX_SIZE_MB}MB`);
      continue;
    }
    validFiles.push(file);
  }

  if (validFiles.length === 0) return;

  setError(null);
  setFiles((prev) => [...prev, ...validFiles]);
};

  const handleUpload = () => {
    if (files.length === 0) return;

    const formData = new FormData();
    files.forEach((file) => {
      formData.append("images", file);
    });

    mutation.mutate({
      projectCode,
      formData,
    });
  };

  return (
    <div className="flex flex-col gap-3">
      <input
  ref={inputRef}
  type="file"
  accept="image/*"
  multiple
  onChange={(e) => {
    handleFileSelect(e);
    e.currentTarget.value = "";
  }}
/>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button
        onClick={handleUpload}
        disabled={files.length === 0 || mutation.isPending}
        className="px-4 py-2 bg-black text-white rounded disabled:opacity-50"
      >
        {mutation.isPending
          ? "Uploading…"
          : `Upload ${files.length} image${files.length > 1 ? "s" : ""}`}
      </button>

      {mutation.isError && (
        <p className="text-red-500 text-sm">
          {(mutation.error as Error).message}
        </p>
      )}

    {files.length > 0 && (
  <ul className="space-y-2 text-sm text-gray-600">
    {files.map((file, index) => (
      <li
        key={`${file.name}-${index}`}
        className="flex items-center justify-between bg-gray-100 px-3 py-2 rounded"
      >
        <span className="truncate">
          {file.name} – {(file.size / 1024 / 1024).toFixed(2)}MB
        </span>

        <button
          type="button"
          onClick={() => removeFile(index)}
          className="ml-3 text-gray-500 hover:text-red-600"
          aria-label="Remove image"
        >
          ✕
        </button>
      </li>
      
    ))}
  </ul>
  
)}
    </div>
  );
}

export default ImageInput;
