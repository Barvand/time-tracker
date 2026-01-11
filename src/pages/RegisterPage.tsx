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
    <div className="flex items-center justify-center px-4 py-8">
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Opprett ny bruker
        </h1>

        <Formik
          initialValues={{
            name: "",
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
                "Kontoen har blitt opprettet, omdirigerer til innlogging..."
              );
              setTimeout(
                () => navigate("/", { state: { flash: data.message } }),
                4000
              );
            } catch (error: any) {
              const msg =
                error.response?.data?.message ||
                error.response?.data?.error ||
                error.message ||
                "Noe gikk galt";
              setStatus({ error: msg });
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ isSubmitting, status, touched, errors }) => (
            <Form className="space-y-5">
              {status?.error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {status.error}
                </div>
              )}
              {status?.success && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
                  {status.success}
                </div>
              )}

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Navn
                </label>
                <Field
                  name="name"
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                    touched.name && errors.name
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300"
                  }`}
                />
                {touched.name && errors.name && (
                  <div className="text-red-600 text-sm mt-1">{errors.name}</div>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Passord
                </label>
                <Field
                  name="password"
                  type="password"
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                    touched.password && errors.password
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300"
                  }`}
                />
                {touched.password && errors.password && (
                  <div className="text-red-600 text-sm mt-1">
                    {errors.password}
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bekreft passord
                </label>
                <Field
                  name="confirmPassword"
                  type="password"
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                    touched.confirmPassword && errors.confirmPassword
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300"
                  }`}
                />
                {touched.confirmPassword && errors.confirmPassword && (
                  <div className="text-red-600 text-sm mt-1">
                    {errors.confirmPassword}
                  </div>
                )}
              </div>

              {/* Role */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rolle
                </label>
                <Field
                  as="select"
                  name="role"
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-white ${
                    touched.role && errors.role
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300"
                  }`}
                >
                  <option value="admin">Administrator</option>
                  <option value="accountant">Regnskapsfører</option>
                  <option value="employee">Ansatt</option>
                </Field>
                {touched.role && errors.role && (
                  <div className="text-red-600 text-sm mt-1">{errors.role}</div>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2.5 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Registrerer..." : "Registrer"}
              </button>

              {successMessage && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
                  {successMessage}
                </div>
              )}
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default RegisterPage;
