import axios from "axios";
import { makeRequest } from "../lib/axios";

export const uploadProjectImage = async ({
  projectCode,
  formData,
}: {
  projectCode: string;
  formData: FormData;
}) => {
  try {
    const res = await makeRequest.post(
      `/projects/${projectCode}/images`,
      formData
    );

    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Image upload failed";

      throw new Error(message);
    }

    throw new Error("Unexpected upload error");
  }
};

export const deleteProjectImage = async (imageId: number) => {
  try {
    const res = await makeRequest.delete(
      `/projects/images/${imageId}`
    );
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Image delete failed";

      throw new Error(message);
    }

    throw new Error("Unexpected delete error");
  }
};
