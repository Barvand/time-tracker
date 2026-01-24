import { useState, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadProjectImage } from "../../api/upload";

const MAX_SIZE_MB = 5;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

export default function ImageInput({ projectCode }: { projectCode: string }) {
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
    if (inputRef.current) inputRef.current.value = "";
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    const validFiles: File[] = [];

    for (const file of selectedFiles) {
      if (file.size > MAX_SIZE_BYTES) {
        setError(`"${file.name}" exceeds ${MAX_SIZE_MB}MB limit`);
        continue;
      }
      validFiles.push(file);
    }

    if (validFiles.length === 0) return;

    setError(null);
    setFiles((prev) => [...prev, ...validFiles]);
  };

  const handleUpload = () => {
    if (!files.length) return;

    const formData = new FormData();
    files.forEach((file) => formData.append("images", file));

    mutation.mutate({ projectCode, formData });
  };

  return (
    <div className="w-full space-y-4 p-2">
      {/* Dropzone */}
      <div
        onClick={() => inputRef.current?.click()}
        className="
          border-2 border-dashed rounded-lg p-6
          text-center cursor-pointer
          transition
          hover:border-black
          bg-gray-50
        "
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => {
            handleFileSelect(e);
            e.currentTarget.value = "";
          }}
        />

        <div className="">
          <p className="font-medium text-gray-700">Click to upload images</p>
          <p className="text-sm text-gray-500">
            PNG, JPG up to {MAX_SIZE_MB}MB
          </p>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 p-2 rounded">
          {error}
        </div>
      )}

      {/* File list */}
      {files.length > 0 && (
        <div className="bg-white border rounded-lg p-3 space-y-2">
          <p className="text-sm font-medium text-gray-600">
            Selected images ({files.length})
          </p>

          <ul className="space-y-2">
            {files.map((file, index) => (
              <li
                key={`${file.name}-${index}`}
                className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded border"
              >
                <div className="truncate text-sm">
                  {file.name}
                  <span className="ml-2 text-gray-400">
                    {(file.size / 1024 / 1024).toFixed(2)}MB
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="text-gray-400 hover:text-red-600 text-sm"
                  title="Remove"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>

          {/* Actions */}
          <div className="flex justify-between items-center pt-3">
            <button
              type="button"
              onClick={clearAll}
              className="text-sm text-gray-500 hover:text-black"
            >
              Clear all
            </button>

            <button
              onClick={handleUpload}
              disabled={mutation.isPending}
              className="
                px-5 py-2 rounded
                bg-black text-white
                disabled:opacity-50
                transition
              "
            >
              {mutation.isPending
                ? "Uploading..."
                : `Upload ${files.length} image${files.length > 1 ? "s" : ""}`}
            </button>
          </div>
        </div>
      )}

      {/* API Error */}
      {mutation.isError && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 p-2 rounded">
          {(mutation.error as Error).message}
        </div>
      )}
    </div>
  );
}
