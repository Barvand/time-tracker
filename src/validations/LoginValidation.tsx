import * as yup from "yup";

const loginSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
  password: yup
    .string()
    .min(4, "Password must be at least 4 characters")
    .max(24, "Password must be at most 24 characters")
    .required("Password is required"),
});

export default loginSchema;
