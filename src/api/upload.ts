import { makeRequest } from "../lib/axios";

export const uploadProjectImage = async ({
  projectCode,
  file,
}: {
  projectCode: string;
  file: File;
}) => {
  const formData = new FormData();
  formData.append("image", file);

  const res = await makeRequest.post(
    `/projects/${projectCode}/images`,
    formData,
  );

  return res.data;
};
