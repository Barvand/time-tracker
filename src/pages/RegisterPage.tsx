import { Formik, Form, Field } from "formik";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import registerUser from "../api/Register";
import type { Role } from "../api/Register";
import userSchema from "../validations/RegistrationValidation";

function RegisterPage() {
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState<string>("");

  return (
    <div className="container flex flex-col gap-2 mx-auto bg-gray-200 p-4">
      <Formik
        initialValues={{
          name: "",
          username: "",
          email: "",
          password: "",
          confirmPassword: "",
          role: "employee" as Role,
        }}
        validationSchema={userSchema}
        onSubmit={async (values, { setSubmitting, setStatus, resetForm }) => {
          try {
            const data = await registerUser(values);
            setStatus({ success: data.message });
            resetForm();
            setSuccessMessage(
              "The account has been created, redirecting to login..."
            );
            setTimeout(
              () => navigate("/login", { state: { flash: data.message } }),
              4000
            );
          } catch (error: any) {
            const msg =
              error.response?.data?.message ||
              error.response?.data?.error ||
              error.message ||
              "Something went wrong";
            setStatus({ error: msg });
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ isSubmitting, status, touched, errors }) => (
          <Form className="flex flex-col gap-2">
            {status?.error && (
              <p className="bg-red-100 text-red-800 border border-red-500 text-center p-2">
                {status.error}
              </p>
            )}
            {status?.success && (
              <p className="bg-green-100 text-green-800 border border-green-500 text-center p-2">
                {status.success}
              </p>
            )}

            <label>Name</label>
            <Field name="name" className="p-2 border" />
            {touched.name && errors.name && (
              <div className="text-red-500 text-sm">{errors.name}</div>
            )}

            <label>Username</label>
            <Field name="username" className="p-2 border" />
            {touched.username && errors.username && (
              <div className="text-red-500 text-sm">{errors.username}</div>
            )}

            <label>Email</label>
            <Field name="email" type="email" className="p-2 border" />
            {touched.email && errors.email && (
              <div className="text-red-500 text-sm">{errors.email}</div>
            )}

            <label>Password</label>
            <Field name="password" type="password" className="p-2 border" />
            {touched.password && errors.password && (
              <div className="text-red-500 text-sm">{errors.password}</div>
            )}

            <label>Confirm Password</label>
            <Field
              name="confirmPassword"
              type="password"
              className="p-2 border"
            />
            {touched.confirmPassword && errors.confirmPassword && (
              <div className="text-red-500 text-sm">
                {errors.confirmPassword}
              </div>
            )}

            <label>Role</label>
            <Field as="select" name="role" className="p-2 border">
              <option value="admin">Admin</option>
              <option value="accountant">Accountant</option>
              <option value="employee">Employee</option>
            </Field>
            {touched.role && errors.role && (
              <div className="text-red-500 text-sm">{errors.role}</div>
            )}
            <button
              type="submit"
              className="p-2 border bg-white mt-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Registering..." : "Register"}
            </button>
            {successMessage && (
              <div className="text-green-600 text-md p-4 bg-green-100 border border-green">
                {successMessage}
              </div>
            )}
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default RegisterPage;
