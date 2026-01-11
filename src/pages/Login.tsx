import { Formik, Form, Field } from "formik";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../features/auth/useAuth";
import loginSchema from "../validations/LoginValidation";
import { useEffect } from "react";

export default function LoginPage() {
  const { login, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If already logged in, redirect based on role
    if (user) {
      if (user.role === "admin") {
        navigate("/admin/dashboard");
      } else if (user.role === "accountant") {
        navigate("/accountant/dashboard");
      } else {
        navigate("/employee/dashboard");
      }
    }
  }, [user, navigate]);

  return (
    <div className="flex items-center justify-center px-4 py-8 min-h-screen">
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-8 max-w-md w-full">
        <Formik
          initialValues={{ name: "", password: "" }}
          validationSchema={loginSchema}
          onSubmit={async (values, { setSubmitting, setStatus }) => {
            try {
              await login(values.name, values.password);
              // no navigate here — useEffect will handle it
            } catch (err: any) {
              setStatus(err?.response?.data?.message || "Innlogging mislyktes");
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ isSubmitting, errors, touched, status }) => (
            <Form className="space-y-5">
              {status && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {status}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Navn
                </label>
                <Field
                  name="name"
                  type="text"
                  placeholder=""
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Passord
                </label>
                <Field
                  name="password"
                  type="password"
                  placeholder="••••••••"
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

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 text-white py-2.5 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Logger inn..." : "Logg inn"}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
