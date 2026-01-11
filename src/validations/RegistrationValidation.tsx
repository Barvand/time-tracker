import * as yup from "yup";

const userSchema = yup.object().shape({
  name: yup
    .string()
    .required("Name is required")
    .matches(
      /^[^\d]/, // This regex ensures that the name does not start with a number
      "Name cannot start with a number"
    ),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(24, "Password must be at most 24 characters")
    .matches(/[A-Z]/, "Need an uppercase letter")
    .matches(/[a-z]/, "Need a lowercase letter")
    .matches(/[0-9]/, "Need a number")
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Please confirm your password"),
  role: yup
    .string()
    .oneOf(["admin", "accountant", "employee"], "Invalid role selected")
    .required("Role is required"),
});

export default userSchema;
